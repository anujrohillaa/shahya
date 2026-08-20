import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : (firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null);
export const auth = app ? getAuth(app) : null;

/**
 * Initializes invisible reCAPTCHA verifier for Phone Auth
 */
export function setupRecaptcha(containerId: string = 'recaptcha-container') {
  if (typeof window === 'undefined' || !auth) return null;

  try {
    // If verifier already exists and rendered, reuse it
    if ((window as any).recaptchaVerifier) {
      return (window as any).recaptchaVerifier;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`reCAPTCHA container #${containerId} not found in DOM`);
      return null;
    }

    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        // Response expired
        if ((window as any).recaptchaVerifier) {
          try {
            (window as any).recaptchaVerifier.clear();
          } catch (e) {}
          (window as any).recaptchaVerifier = null;
        }
      },
    });

    (window as any).recaptchaVerifier = verifier;
    return verifier;
  } catch (error) {
    console.error('Error setting up reCAPTCHA:', error);
    return null;
  }
}

/**
 * Sends real SMS OTP to the user's mobile number via Firebase Auth
 */
export async function sendPhoneOtp(phoneNumber: string, recaptchaVerifier: any): Promise<ConfirmationResult | null> {
  if (!auth) {
    throw new Error('Firebase is not configured. Please verify NEXT_PUBLIC_FIREBASE_API_KEY in environment variables.');
  }

  // Format phone number to E.164 (e.g. +919876543210)
  let formattedPhone = phoneNumber.trim().replace(/[\s-]/g, '');
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = `+91${formattedPhone}`;
  }

  return await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
}
