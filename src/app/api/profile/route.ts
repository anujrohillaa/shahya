import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        avatar: data.avatar !== undefined ? data.avatar : undefined,
        age: data.age !== undefined ? (data.age ? parseInt(data.age) : null) : undefined,
        gender: data.gender !== undefined ? data.gender : undefined,
        occupation: data.occupation !== undefined ? data.occupation : undefined,
        companyCollege: data.companyCollege !== undefined ? data.companyCollege : undefined,
        bio: data.bio !== undefined ? data.bio : undefined,
        smoking: data.smoking !== undefined ? data.smoking : undefined,
        drinking: data.drinking !== undefined ? data.drinking : undefined,
        foodPreference: data.foodPreference !== undefined ? data.foodPreference : undefined,
        sleepSchedule: data.sleepSchedule !== undefined ? data.sleepSchedule : undefined,
        cleanliness: data.cleanliness !== undefined ? data.cleanliness : undefined,
        pets: data.pets !== undefined ? data.pets : undefined,
        genderPreference: data.genderPreference !== undefined ? data.genderPreference : undefined,
      },
    });

    return NextResponse.json({ message: 'Profile updated successfully', user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
