import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { roleOrEmail } = await req.json();

    if (roleOrEmail === 'logout') {
      const response = NextResponse.json({ message: 'Logged out' });
      response.cookies.set('flatmate_token', '', {
        httpOnly: true,
        path: '/',
        maxAge: 0,
      });
      return response;
    }

    let user;
    if (roleOrEmail === 'admin') {
      user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    } else if (roleOrEmail === 'rahul') {
      user = await prisma.user.findFirst({ where: { email: 'rahul.sharma@example.com' } });
    } else if (roleOrEmail === 'priya') {
      user = await prisma.user.findFirst({ where: { email: 'priya.patel@example.com' } });
    } else {
      user = await prisma.user.findFirst({
        where: {
          OR: [{ email: roleOrEmail }, { id: roleOrEmail }]
        }
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Demo user not found. Please run seed script.' }, { status: 404 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    const response = NextResponse.json({
      message: `Switched to ${user.name}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    });

    response.cookies.set('flatmate_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
