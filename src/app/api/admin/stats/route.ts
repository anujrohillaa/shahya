import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      newUsersToday,
      activeListings,
      totalListings,
      openReports,
      activeChats,
      blockedUsersCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.listing.count({ where: { status: 'ACTIVE' } }),
      prisma.listing.count(),
      prisma.report.count({ where: { status: { in: ['NEW', 'UNDER_REVIEW'] } } }),
      prisma.conversation.count(),
      prisma.user.count({ where: { status: 'BANNED' } }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        newUsersToday,
        activeListings,
        totalListings,
        openReports,
        activeChats,
        blockedUsersCount,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
