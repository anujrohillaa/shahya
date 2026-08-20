import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    // Also count unread messages & notifications if logged in
    let unreadMessagesCount = 0;
    let notificationsCount = 0;

    if (user) {
      // Find conversations user is part of
      const conversations = await prisma.conversation.findMany({
        where: {
          OR: [{ user1Id: user.id }, { user2Id: user.id }],
        },
        select: { id: true }
      });
      const convoIds = conversations.map(c => c.id);

      unreadMessagesCount = await prisma.message.count({
        where: {
          conversationId: { in: convoIds },
          senderId: { not: user.id },
          isRead: false,
        }
      });

      notificationsCount = await prisma.notification.count({
        where: {
          userId: user.id,
          isRead: false,
        }
      });
    }

    return NextResponse.json(
      {
        user,
        unreadMessagesCount,
        notificationsCount,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('Session endpoint error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
