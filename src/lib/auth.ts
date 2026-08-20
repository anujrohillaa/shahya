import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'flatmate-super-secret-key-12345';

export interface TokenPayload {
  userId: string;
  email?: string | null;
  phone?: string | null;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('flatmate_token')?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        age: true,
        gender: true,
        occupation: true,
        companyCollege: true,
        bio: true,
        isPhoneVerified: true,
        isEmailVerified: true,
        isIdVerified: true,
        role: true,
        status: true,
        smoking: true,
        drinking: true,
        foodPreference: true,
        sleepSchedule: true,
        cleanliness: true,
        pets: true,
        genderPreference: true,
        createdAt: true,
      },
    });

    if (!user || user.status === 'BANNED') return null;

    return user;
  } catch (error) {
    return null;
  }
}
