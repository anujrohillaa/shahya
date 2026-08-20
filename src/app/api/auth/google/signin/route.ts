import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, name, avatar, googleId } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Google email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || cleanEmail.split('@')[0] || 'Google User').trim();
    const cleanAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`;

    // Find existing user by email
    let user = await prisma.user.findFirst({
      where: {
        email: cleanEmail,
      },
    });

    if (!user) {
      // Create new user with verified Google email
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: cleanName,
          avatar: cleanAvatar,
          isEmailVerified: true,
          isPhoneVerified: false,
          role: 'USER',
          status: 'ACTIVE',
        },
      });
    } else {
      // Check account status
      if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
        return NextResponse.json(
          { error: `Account is ${user.status.toLowerCase()}. Please contact support.` },
          { status: 403 }
        );
      }

      // Update avatar or email verification if not yet set
      if (!user.isEmailVerified || (!user.avatar && cleanAvatar)) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            isEmailVerified: true,
            avatar: user.avatar || cleanAvatar,
          },
        });
      }
    }

    // Sign session token
    const token = signToken({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Signed in with Google successfully',
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
    console.error('Google Signin Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to authenticate with Google' },
      { status: 500 }
    );
  }
}
