import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isPhoneVerified: true,
          }
        },
        photos: {
          take: 1,
        },
        _count: {
          select: {
            reports: true,
            savedBy: true,
            conversations: true,
          }
        }
      }
    });

    return NextResponse.json({ listings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { listingId, status } = await req.json();

    if (!listingId || !status) {
      return NextResponse.json({ error: 'Listing ID and status required' }, { status: 400 });
    }

    const updated = await prisma.listing.update({
      where: { id: listingId },
      data: { status }
    });

    return NextResponse.json({ message: 'Listing status updated', listing: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
