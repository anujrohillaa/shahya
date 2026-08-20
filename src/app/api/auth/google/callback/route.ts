import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state') || '/explore';
  const error = searchParams.get('error');

  const origin = req.nextUrl.origin;

  if (error || !code) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error || 'Google sign-in was cancelled')}`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/login?error=Google+OAuth+credentials+not+configured`);
  }

  try {
    const redirectUri = `${origin}/api/auth/google/callback`;

    // 1. Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errData = await tokenRes.text();
      console.error('Google token exchange failed:', errData);
      return NextResponse.redirect(`${origin}/login?error=Failed+to+exchange+Google+token`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch User Profile from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${origin}/login?error=Failed+to+fetch+Google+profile`);
    }

    const googleUser = await userRes.json();
    const email = googleUser.email?.toLowerCase();
    const name = googleUser.name || email?.split('@')[0] || 'Google User';
    const avatar = googleUser.picture;

    if (!email) {
      return NextResponse.redirect(`${origin}/login?error=No+email+provided+by+Google`);
    }

    // 3. Find or create user
    let user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          avatar,
          isEmailVerified: true,
          isPhoneVerified: false,
          role: 'USER',
          status: 'ACTIVE',
        },
      });
    } else {
      if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
        return NextResponse.redirect(`${origin}/login?error=Account+is+${user.status.toLowerCase()}`);
      }

      if (!user.isEmailVerified || (!user.avatar && avatar)) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            isEmailVerified: true,
            avatar: user.avatar || avatar,
          },
        });
      }
    }

    // 4. Issue session token
    const token = signToken({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    const destination = decodeURIComponent(state).startsWith('/') ? decodeURIComponent(state) : '/explore';
    const response = NextResponse.redirect(new URL(destination, req.url));

    response.cookies.set('flatmate_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(err.message || 'Google authentication failed')}`);
  }
}
