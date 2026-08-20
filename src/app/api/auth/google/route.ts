import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const returnUrl = searchParams.get('returnUrl') || '/explore';

  const clientId = process.env.GOOGLE_CLIENT_ID;

  // If live Google OAuth credentials are configured
  if (clientId) {
    const origin = req.nextUrl.origin;
    const redirectUri = `${origin}/api/auth/google/callback`;
    const scope = encodeURIComponent('openid email profile');
    const state = encodeURIComponent(returnUrl);

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;

    return NextResponse.redirect(googleAuthUrl);
  }

  // Fallback if credentials not set yet: redirect to login with google chooser modal
  return NextResponse.redirect(new URL('/login?google=select', req.url));
}
