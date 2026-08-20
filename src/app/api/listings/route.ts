import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const currentUser = await getCurrentUser();

    const type = searchParams.get('type'); // HAVE_PLACE, NEED_PLACE
    const city = searchParams.get('city');
    const q = searchParams.get('q');
    const minRent = searchParams.get('minRent') ? parseInt(searchParams.get('minRent')!) : undefined;
    const maxRent = searchParams.get('maxRent') ? parseInt(searchParams.get('maxRent')!) : undefined;
    const gender = searchParams.get('gender');
    const roomType = searchParams.get('roomType');
    const propertyType = searchParams.get('propertyType');
    const sort = searchParams.get('sort') || 'newest';
    const userId = searchParams.get('userId');
    const status = searchParams.get('status') || 'ACTIVE';

    const where: any = {};

    if (status !== 'ALL') {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (userId) {
      where.userId = userId;
    }

    if (city && city.toLowerCase() !== 'all') {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (gender && gender !== 'ANY') {
      where.OR = [
        { preferredGender: gender },
        { preferredGender: 'ANY' },
        { preferredGender: null },
      ];
    }

    if (roomType && roomType !== 'ALL') {
      where.roomType = roomType;
    }

    if (propertyType && propertyType !== 'ALL') {
      where.propertyType = propertyType;
    }

    if (minRent !== undefined || maxRent !== undefined) {
      where.rent = {};
      if (minRent !== undefined) where.rent.gte = minRent;
      if (maxRent !== undefined) where.rent.lte = maxRent;
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { locality: { contains: q, mode: 'insensitive' } },
        { landmark: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'rent_asc') {
      orderBy = { rent: 'asc' };
    } else if (sort === 'rent_desc') {
      orderBy = { rent: 'desc' };
    } else if (sort === 'views') {
      orderBy = { viewsCount: 'desc' };
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy,
      take: 100,
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
            isPhoneVerified: true,
            isEmailVerified: true,
            isIdVerified: true,
            smoking: true,
            drinking: true,
            foodPreference: true,
            pets: true,
            sleepSchedule: true,
          }
        },
        savedBy: currentUser ? {
          where: { userId: currentUser.id },
          select: { id: true },
        } : false,
      }
    });

    const formatted = listings.map(l => ({
      ...l,
      isSaved: currentUser ? l.savedBy && l.savedBy.length > 0 : false,
      amenities: l.amenities.map(a => a.name),
      preferences: l.preferences.map(p => p.tag),
    }));

    return NextResponse.json({ listings: formatted, total: formatted.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to post a listing.' }, { status: 401 });
    }

    const data = await req.json();

    const {
      type = 'HAVE_PLACE',
      title,
      description,
      propertyType,
      roomType,
      bedrooms,
      bathrooms,
      currentLiving,
      vacancies = 1,
      rent,
      minBudget,
      maxBudget,
      securityDeposit = 0,
      utilityEstimate = 0,
      city,
      locality,
      landmark,
      address,
      availableFrom,
      moveInImmediate = false,
      minimumStay = 'FLEXIBLE',
      preferredGender = 'ANY',
      preferredTenant = 'ANY',
      photos = [],
      amenities = [],
      preferences = [],
      status = 'ACTIVE',
    } = data;

    if (!title || !city || !locality) {
      return NextResponse.json({ error: 'Title, City, and Locality are required' }, { status: 400 });
    }

    const listing = await prisma.listing.create({
      data: {
        userId: user.id,
        type,
        title,
        description: description || '',
        propertyType: propertyType || null,
        roomType: roomType || null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        currentLiving: currentLiving ? parseInt(currentLiving) : null,
        vacancies: vacancies ? parseInt(vacancies) : 1,
        rent: parseInt(rent) || 0,
        minBudget: minBudget ? parseInt(minBudget) : null,
        maxBudget: maxBudget ? parseInt(maxBudget) : null,
        securityDeposit: parseInt(securityDeposit) || 0,
        utilityEstimate: parseInt(utilityEstimate) || 0,
        brokerage: 0,
        city,
        locality,
        landmark: landmark || null,
        address: address || null,
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        moveInImmediate: Boolean(moveInImmediate),
        minimumStay,
        preferredGender,
        preferredTenant,
        status,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30-day lifecycle
        photos: {
          create: photos.map((p: any, idx: number) => ({
            url: typeof p === 'string' ? p : p.url,
            isCover: idx === 0,
            order: idx,
          })),
        },
        amenities: {
          create: amenities.map((name: string) => ({ name })),
        },
        preferences: {
          create: preferences.map((tag: string) => ({ tag })),
        },
      },
      include: {
        photos: true,
        amenities: true,
        preferences: true,
      }
    });

    return NextResponse.json({ message: 'Listing created successfully', listing }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
