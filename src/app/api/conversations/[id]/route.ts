import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        listing: {
          include: {
            photos: {
              take: 1,
              orderBy: { order: 'asc' },
            }
          }
        },
        user1: {
          select: {
            id: true,
            name: true,
            avatar: true,
            occupation: true,
            isPhoneVerified: true,
            phone: false,
          }
        },
        user2: {
          select: {
            id: true,
            name: true,
            avatar: true,
            occupation: true,
            isPhoneVerified: true,
            phone: false,
          }
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatar: true,
              }
            }
          }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (conversation.user1Id !== user.id && conversation.user2Id !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Calculate how many were unread BEFORE marking them as read
    const clearedUnreadCount = conversation.messages.filter(m => !m.isRead && m.senderId !== user.id).length;

    // Mark messages from other user as read
    await prisma.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: user.id },
        isRead: false,
      },
      data: { isRead: true },
    });

    const otherUser = conversation.user1Id === user.id ? conversation.user2 : conversation.user1;

    return NextResponse.json({
      clearedUnreadCount,
      conversation: {
        id: conversation.id,
        listingId: conversation.listingId,
        listing: conversation.listing,
        otherUser,
        messages: conversation.messages.map(m => ({
          id: m.id,
          conversationId: m.conversationId,
          senderId: m.senderId,
          senderName: m.sender.name,
          senderAvatar: m.sender.avatar,
          text: m.text,
          imageUrl: m.imageUrl,
          isRead: m.isRead,
          createdAt: m.createdAt,
        })),
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
