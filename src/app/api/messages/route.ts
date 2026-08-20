import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { broadcastNewMessage, broadcastNotification } from '@/lib/realtime';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, text, imageUrl } = await req.json();

    if (!conversationId || (!text && !imageUrl)) {
      return NextResponse.json({ error: 'Conversation ID and text/image required' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        listing: true,
      }
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
        ]
      }
    });

    if (isBlocked) {
      return NextResponse.json({ error: 'Cannot send message to this user' }, { status: 403 });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        text: text || '📷 Image',
        imageUrl: imageUrl || null,
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    });

    // Update conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageText: text || '📷 Image',
        lastMessageAt: new Date(),
      }
    });

    // Create notification for recipient
    const notif = await prisma.notification.create({
      data: {
        userId: recipientId,
        title: `Message from ${user.name}`,
        message: text.length > 60 ? `${text.slice(0, 60)}...` : text,
        link: `/messages/${conversationId}`,
        type: 'MESSAGE',
      }
    });

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

    // Broadcast in real-time
    broadcastNewMessage(payload);
    broadcastNotification(notif);

    return NextResponse.json({ message: payload }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
