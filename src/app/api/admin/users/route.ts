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
    const search = searchParams.get('search');

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            listings: true,
            reportsReceived: true,
          }
        }
      }
    });

    return NextResponse.json({ users });
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

    const { userId, status, isPhoneVerified, isIdVerified, role } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        status: status !== undefined ? status : undefined,
        isPhoneVerified: isPhoneVerified !== undefined ? isPhoneVerified : undefined,
        isIdVerified: isIdVerified !== undefined ? isIdVerified : undefined,
        role: role !== undefined ? role : undefined,
      }
    });

    return NextResponse.json({ message: 'User updated successfully', user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
