import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { emailOrPhone, password } = await req.json();

    if (!emailOrPhone || !password) {
      return NextResponse.json({ error: 'Please provide email/phone and password' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhone.toLowerCase() },
          { phone: emailOrPhone },
        ],
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      return NextResponse.json({ error: `Account is ${user.status.toLowerCase()}. Please contact support.` }, { status: 403 });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    const response = NextResponse.json({
      message: 'Logged in successfully',
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
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
