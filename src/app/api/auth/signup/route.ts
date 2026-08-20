import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, gender, occupation } = await req.json();

    if (!name || !password || (!email && !phone)) {
      return NextResponse.json({ error: 'Name, password, and email/phone are required' }, { status: 400 });
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (existingEmail) {
        return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
      }
    }

    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        return NextResponse.json({ error: 'Phone number is already registered' }, { status: 400 });
      }
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: email ? email.toLowerCase() : null,
        phone: phone || null,
        passwordHash,
        gender: gender || null,
        occupation: occupation || 'WORKING_PROFESSIONAL',
        isPhoneVerified: !!phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    const response = NextResponse.json({
      message: 'Account created successfully',
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
