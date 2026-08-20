import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const saved = await prisma.savedListing.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          include: {
            photos: {
              orderBy: { order: 'asc' },
            },
            amenities: true,
            preferences: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                occupation: true,
                isPhoneVerified: true,
              }
            }
          }
        }
      }
    });

    const listings = saved.map(s => ({
      ...s.listing,
      isSaved: true,
      amenities: s.listing.amenities.map(a => a.name),
      preferences: s.listing.preferences.map(p => p.tag),
    }));

    return NextResponse.json({ listings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to save listings.' }, { status: 401 });
    }

    const { listingId } = await req.json();
    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 });
    }

    const existing = await prisma.savedListing.findUnique({
      where: {
        userId_listingId: {
          userId: user.id,
          listingId,
        }
      }
    });

    if (existing) {
      await prisma.savedListing.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ saved: false, message: 'Removed from saved listings' });
    } else {
      await prisma.savedListing.create({
        data: {
          userId: user.id,
          listingId,
        }
      });
      return NextResponse.json({ saved: true, message: 'Saved to favorites' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
