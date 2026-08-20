import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: user.id }, { user2Id: user.id }],
      },
      orderBy: { lastMessageAt: 'desc' },
      include: {
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
          }
        },
        user2: {
          select: {
            id: true,
            name: true,
            avatar: true,
            occupation: true,
            isPhoneVerified: true,
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        }
      }
    });

    const formatted = await Promise.all(conversations.map(async (c) => {
      const otherUser = c.user1Id === user.id ? c.user2 : c.user1;
      const unreadCount = await prisma.message.count({
        where: {
          conversationId: c.id,
          senderId: otherUser.id,
          isRead: false,
        }
      });

      return {
        id: c.id,
        listingId: c.listingId,
        listing: c.listing,
        otherUser,
        lastMessageText: c.lastMessageText || (c.messages[0]?.text ?? ''),
        lastMessageAt: c.lastMessageAt,
        unreadCount,
      };
    }));

    return NextResponse.json({ conversations: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to chat.' }, { status: 401 });
    }

    const { listingId, targetUserId, initialMessage } = await req.json();

    // --- Direct profile-to-profile chat (no listing needed) ---
    if (!listingId && targetUserId) {
      if (targetUserId === user.id) {
        return NextResponse.json({ error: 'You cannot chat with yourself.' }, { status: 400 });
      }

      const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
      if (!targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Find existing direct conversation between these two users (no listing)
      let conversation = await prisma.conversation.findFirst({
        where: {
          listingId: null,
          OR: [
            { user1Id: user.id, user2Id: targetUserId },
            { user1Id: targetUserId, user2Id: user.id },
          ],
        },
      });

      if (!conversation) {
        const msg = initialMessage || `Hi ${targetUser.name}, I found your profile on Shahya!`;
        conversation = await prisma.conversation.create({
          data: {
            listingId: null,
            user1Id: user.id,
            user2Id: targetUserId,
            lastMessageText: msg,
            lastMessageAt: new Date(),
            messages: {
              create: { senderId: user.id, text: msg, isRead: false },
            },
          },
        });
      }

      return NextResponse.json({ conversationId: conversation.id });
    }

    // --- Listing-based conversation ---
    if (!listingId) {
      return NextResponse.json({ error: 'Either listingId or targetUserId is required' }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { user: true },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.userId === user.id) {
      return NextResponse.json({ error: 'You cannot start a chat with yourself on your own listing' }, { status: 400 });
    }

    // Check if conversation already exists (either as user1 or user2)
    let conversation = await prisma.conversation.findFirst({
      where: {
        listingId,
        OR: [
          { user1Id: user.id, user2Id: listing.userId },
          { user1Id: listing.userId, user2Id: user.id },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          listingId,
          user1Id: user.id,
          user2Id: listing.userId,
          lastMessageText: initialMessage || 'Hi, is this listing still available?',
          lastMessageAt: new Date(),
          messages: initialMessage
            ? { create: { senderId: user.id, text: initialMessage, isRead: false } }
            : undefined,
        },
      });
    }

    return NextResponse.json({ conversationId: conversation.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
