import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { broadcastNewMessage, broadcastNotification } from '@/lib/realtime';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId parameter required' }, { status: 400 });
    }

    // 1. Verify user is part of the conversation (fast indexed check)
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        user1Id: true,
        user2Id: true,
        listingId: true,
        listing: {
          select: {
            id: true,
            title: true,
            rent: true,
            city: true,
            locality: true,
            photos: {
              take: 1,
              orderBy: { order: 'asc' },
              select: { url: true },
            },
          },
        },
        user1: {
          select: {
            id: true,
            name: true,
            avatar: true,
            occupation: true,
            isPhoneVerified: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            avatar: true,
            occupation: true,
            isPhoneVerified: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (conversation.user1Id !== user.id && conversation.user2Id !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Fetch messages ordered by createdAt ascending
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 100,
      select: {
        id: true,
        conversationId: true,
        senderId: true,
        text: true,
        imageUrl: true,
        isRead: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Calculate how many were unread before marking read
    const clearedUnreadCount = messages.filter(m => !m.isRead && m.senderId !== user.id).length;

    // 3. Mark unread incoming messages as read in the background without blocking response
    prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: user.id },
        isRead: false,
      },
      data: { isRead: true },
    }).catch(() => {});

    const otherUser = conversation.user1Id === user.id ? conversation.user2 : conversation.user1;

    const formattedMessages = messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      senderName: m.sender.name,
      senderAvatar: m.sender.avatar,
      text: m.text,
      imageUrl: m.imageUrl,
      isRead: m.isRead,
      createdAt: m.createdAt,
    }));

    return NextResponse.json({
      clearedUnreadCount,
      messages: formattedMessages,
      otherUser,
      listing: conversation.listing,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, text, imageUrl } = await req.json();

    if (!conversationId || (!text && !imageUrl)) {
      return NextResponse.json({ error: 'Conversation ID and text/image required' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        user1Id: true,
        user2Id: true,
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (conversation.user1Id !== user.id && conversation.user2Id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const recipientId = conversation.user1Id === user.id ? conversation.user2Id : conversation.user1Id;

    // Check if recipient blocked user or user blocked recipient
    const isBlocked = await prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: recipientId, blockedId: user.id },
          { blockerId: user.id, blockedId: recipientId },
        ],
      },
      select: { id: true },
    });

    if (isBlocked) {
      return NextResponse.json({ error: 'Cannot send message to this user' }, { status: 403 });
    }

    const messageText = text || '📷 Image';

    // Create message and update conversation in parallel transaction
    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          senderId: user.id,
          text: messageText,
          imageUrl: imageUrl || null,
          isRead: false,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageText: messageText,
          lastMessageAt: new Date(),
        },
      }),
    ]);

    // Create notification in background (non-blocking)
    prisma.notification.create({
      data: {
        userId: recipientId,
        title: `Message from ${message.sender.name}`,
        message: messageText.length > 60 ? `${messageText.slice(0, 60)}...` : messageText,
        link: `/messages/${conversationId}`,
        type: 'MESSAGE',
      },
    }).catch(() => {});

    const payload = {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: message.sender.name,
      senderAvatar: message.sender.avatar,
      text: message.text,
      imageUrl: message.imageUrl,
      isRead: message.isRead,
      createdAt: message.createdAt,
    };

    // Broadcast in real-time instantly
    broadcastNewMessage(payload);

    return NextResponse.json({ message: payload }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
