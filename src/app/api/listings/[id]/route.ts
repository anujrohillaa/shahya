import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const currentUser = getAuthUser();

    // Increment views count asynchronously
    await prisma.listing.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => null);

    const listing = await prisma.listing.findUnique({
      where: { id },
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
            age: true,
            gender: true,
            occupation: true,
            companyCollege: true,
            bio: true,
            isPhoneVerified: true,
            isEmailVerified: true,
            isIdVerified: true,
            smoking: true,
            drinking: true,
            foodPreference: true,
            sleepSchedule: true,
            cleanliness: true,
            pets: true,
            createdAt: true,
          }
        },
        savedBy: currentUser ? {
          where: { userId: currentUser.id },
          select: { id: true },
        } : false,
      }
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const formatted = {
      ...listing,
      isSaved: currentUser ? listing.savedBy && listing.savedBy.length > 0 : false,
      amenities: listing.amenities.map(a => a.name),
      preferences: listing.preferences.map(p => p.tag),
    };

    return NextResponse.json({ listing: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (existing.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();

    // If renew action
    let newExpiresAt = existing.expiresAt;
    if (data.action === 'renew') {
      newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      data.status = 'ACTIVE';
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        description: data.description !== undefined ? data.description : undefined,
        rent: data.rent !== undefined ? parseInt(data.rent) : undefined,
        status: data.status !== undefined ? data.status : undefined,
        expiresAt: newExpiresAt,
        propertyType: data.propertyType !== undefined ? data.propertyType : undefined,
        roomType: data.roomType !== undefined ? data.roomType : undefined,
        securityDeposit: data.securityDeposit !== undefined ? parseInt(data.securityDeposit) : undefined,
        utilityEstimate: data.utilityEstimate !== undefined ? parseInt(data.utilityEstimate) : undefined,
        city: data.city !== undefined ? data.city : undefined,
        locality: data.locality !== undefined ? data.locality : undefined,
      },
    });

    return NextResponse.json({ message: 'Listing updated', listing: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (existing.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.listing.delete({ where: { id } });

    return NextResponse.json({ message: 'Listing deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
