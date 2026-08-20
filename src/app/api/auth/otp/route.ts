import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { idToken, phone, name } = await req.json();

    let verifiedPhone = phone;

    // If Firebase Admin credentials are configured, verify the idToken
    if (idToken && process.env.FIREBASE_PROJECT_ID) {
      try {
        const admin = require('firebase-admin');
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
          });
        }
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        verifiedPhone = decodedToken.phone_number || phone;
      } catch (adminErr) {
        console.warn('Firebase Admin verification skipped or fallback:', adminErr);
      }
    }

    if (!verifiedPhone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Normalize phone number format (e.g. +91 98765 43210 -> +919876543210)
    let cleanPhone = verifiedPhone.trim().replace(/[\s-]/g, '');
    if (!cleanPhone.startsWith('+')) {
      cleanPhone = `+91${cleanPhone}`;
    }

    const cleanName = (name || `User ${cleanPhone.slice(-4)}`).trim();

    // Find existing user by phone
    let user = await prisma.user.findFirst({
      where: {
        phone: cleanPhone,
      },
    });

    if (!user) {
      // Create new user with verified phone
      user = await prisma.user.create({
        data: {
          phone: cleanPhone,
          name: cleanName,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
          isPhoneVerified: true,
          isEmailVerified: false,
          role: 'USER',
          status: 'ACTIVE',
        },
      });
    } else {
      if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
        return NextResponse.json(
          { error: `Account is ${user.status.toLowerCase()}. Please contact support.` },
          { status: 403 }
        );
      }

      if (!user.isPhoneVerified) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { isPhoneVerified: true },
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
      message: 'Logged in with Phone successfully',
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
    console.error('OTP Authentication error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to authenticate phone OTP' },
      { status: 500 }
    );
  }
}
