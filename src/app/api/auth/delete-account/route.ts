import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please login to delete your account.' }, { status: 401 });
    }

    // 1. Delete associated data
    // Delete user's conversations and messages
    await prisma.conversation.deleteMany({
      where: {
        OR: [{ user1Id: user.id }, { user2Id: user.id }],
      },
    });

    // Delete user's saved listings
    await prisma.savedListing.deleteMany({
      where: { userId: user.id },
    });

    // Delete user's listings (photos will cascade)
    await prisma.listing.deleteMany({
      where: { userId: user.id },
    });

    // Delete the user record
    await prisma.user.delete({
      where: { id: user.id },
    });

    // 2. Clear authentication session cookies
    const cookieStore = cookies();
    cookieStore.delete('flatmate_session');
    cookieStore.delete('session');

    return NextResponse.json({
      success: true,
      message: 'Your account and all personal data have been permanently erased.',
    });
  } catch (error: any) {
    console.error('Error deleting user account:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete account' }, { status: 500 });
  }
}
