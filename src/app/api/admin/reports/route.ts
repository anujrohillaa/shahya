import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        reportedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          }
        },
        listing: {
          select: {
            id: true,
            title: true,
            rent: true,
            city: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ reports });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { reportId, status, adminNotes, action } = await req.json();

    if (!reportId || !status) {
      return NextResponse.json({ error: 'Report ID and status required' }, { status: 400 });
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { listing: true, reportedUser: true }
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Execute specific administrative action if specified
    if (action === 'REMOVE_LISTING' && report.listingId) {
      await prisma.listing.update({
        where: { id: report.listingId },
        data: { status: 'CLOSED' }
      });
    } else if (action === 'BAN_USER' && (report.reportedUserId || report.listing?.userId)) {
      const targetUserId = report.reportedUserId || report.listing?.userId;
      if (targetUserId) {
        await prisma.user.update({
          where: { id: targetUserId },
          data: { status: 'BANNED' }
        });
      }
    }

    const updated = await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      }
    });

    return NextResponse.json({ message: 'Report updated successfully', report: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
