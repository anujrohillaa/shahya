import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to submit a report.' }, { status: 401 });
    }

    const { listingId, reportedUserId, reason, description } = await req.json();

    if (!reason) {
      return NextResponse.json({ error: 'Reason is required' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        reporterId: user.id,
        listingId: listingId || null,
        reportedUserId: reportedUserId || null,
        reason,
        description: description || '',
        status: 'NEW',
      }
    });

    return NextResponse.json({
      message: 'Thank you for keeping FlatMate safe. Our moderation team is reviewing this report.',
      reportId: report.id,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
