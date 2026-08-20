import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        occupation: true,
        companyCollege: true,
        age: true,
        gender: true,
        smoking: true,
        foodPreference: true,
        sleepSchedule: true,
        cleanliness: true,
        pets: true,
        genderPreference: true,
        isPhoneVerified: true,
        createdAt: true,
        _count: { select: { listings: { where: { status: 'ACTIVE' } } } },
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
