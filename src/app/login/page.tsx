'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import {
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  Check
} from 'lucide-react';

function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function LoginContent() {
  const { refreshSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'OTP'>('LOGIN');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // Check URL error or google param on load
  useEffect(() => {
    const errParam = searchParams.get('error');
    if (errParam) {
      setError(errParam);
    }
    if (searchParams.get('google') === 'select') {
      setShowGoogleModal(true);
    }
  }, [searchParams]);

  // Google Login Handler
  const handleGoogleLogin = async (customUser?: { email: string; name: string; avatar?: string }) => {
    setGoogleLoading(true);
    setError('');

    try {
      if (customUser) {
        // Direct Google Signin with chosen account
        const res = await fetch('/api/auth/google/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customUser),
        });

        if (res.ok) {
          await refreshSession();
          setShowGoogleModal(false);
          router.push('/explore');
          return;
        } else {
          const data = await res.json();
          setError(data.error || 'Failed to sign in with Google');
        }
      } else {
        // Redirect to Google OAuth start endpoint
        window.location.href = '/api/auth/google';
      }
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password }),
      });

      if (res.ok) {
        await refreshSession();
        router.push('/explore');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to login');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const isEmail = emailOrPhone.includes('@');
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: isEmail ? emailOrPhone : undefined,
          phone: !isEmail ? emailOrPhone : undefined,
          password,
        }),
      });

      if (res.ok) {
        await refreshSession();
        router.push('/explore');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to sign up');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpSent) {
      if (!emailOrPhone) {
        setError('Please enter your 10-digit mobile number');
        return;
      }

      setLoading(true);
      try {
        const { setupRecaptcha, sendPhoneOtp } = await import('@/lib/firebase');
        const verifier = setupRecaptcha('recaptcha-container');

        if (!verifier) {
          throw new Error('Could not initialize security verification. Please check that your domain is added to Firebase Authorized Domains.');
        }

        const result = await sendPhoneOtp(emailOrPhone, verifier);
        if (result) {
          setConfirmationResult(result);
          setOtpSent(true);
        } else {
          throw new Error('Failed to send SMS OTP. Please verify your phone number.');
        }
      } catch (fbErr: any) {
        console.error('Firebase Phone Auth Error:', fbErr);
        if (typeof window !== 'undefined') {
          try {
            (window as any).recaptchaVerifier?.clear();
          } catch (e) {}
          (window as any).recaptchaVerifier = null;
        }

        let friendlyMsg = fbErr.message || 'Failed to send SMS OTP';
        if (fbErr.code === 'auth/invalid-phone-number') {
          friendlyMsg = 'Invalid phone number format. Please enter a valid mobile number (e.g. +91 98765 43210).';
        } else if (fbErr.code === 'auth/quota-exceeded') {
          friendlyMsg = 'Firebase SMS quota limit reached for today. You can also sign in with Google or Email/Password.';
        } else if (fbErr.code === 'auth/unauthorized-domain') {
          friendlyMsg = 'This domain is not authorized in Firebase Console. Add this domain in Firebase Console -> Authentication -> Settings -> Authorized Domains.';
        } else if (fbErr.code === 'auth/too-many-requests') {
          friendlyMsg = 'Too many requests. Please wait a few moments before requesting another OTP.';
        } else if (fbErr.code === 'auth/internal-error' || fbErr.code === 'auth/captcha-check-failed') {
          friendlyMsg = 'reCAPTCHA check failed. Please refresh the page and try again.';
        }
        setError(friendlyMsg);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!otpCode || otpCode.trim().length < 6) {
      setError('Please enter the 6-digit OTP received via SMS');
      return;
    }

    setLoading(true);
    try {
      if (!confirmationResult) {
        throw new Error('OTP session expired. Please request a new OTP code.');
      }

      // Verify OTP code with Firebase
      const userCredential = await confirmationResult.confirm(otpCode.trim());
      const idToken = await userCredential.user.getIdToken();
      const verifiedPhone = userCredential.user.phoneNumber || emailOrPhone;

      // Authenticate with server and create session in PostgreSQL
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          phone: verifiedPhone,
          name: name || undefined,
        }),
      });

      if (res.ok) {
        await refreshSession();
        router.push('/explore');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to authenticate phone OTP');
      }
    } catch (err: any) {
      console.error('OTP confirmation error:', err);
      let friendlyMsg = err.message || 'Invalid OTP code';
      if (err.code === 'auth/invalid-verification-code') {
        friendlyMsg = 'Incorrect OTP code. Please check the SMS and try again.';
      } else if (err.code === 'auth/code-expired') {
        friendlyMsg = 'This OTP code has expired. Please request a new code.';
      }
      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <img
              src="/logo.png"
              alt="Shahya - Find Rooms, Flats & Flatmates for Free"
              className="h-14 sm:h-16 w-auto object-contain mx-auto group-hover:scale-105 transition-transform"
            />
          </Link>
          <p className="text-xs text-slate-500 font-semibold">
            Zero Brokerage • Direct Roommate & Flat Connections
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-5">
          
          {/* 1. GOOGLE LOGIN BUTTON */}
          <div>
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={googleLoading || loading}
              className="w-full py-3 px-4 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold text-sm shadow-2xs transition-all flex items-center justify-center gap-3 disabled:opacity-60 group"
            >
              <GoogleIcon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute">
              Or continue with
            </span>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-100 text-xs font-bold text-slate-600">
            <button
              onClick={() => { setMode('LOGIN'); setError(''); }}
              className={`py-2 rounded-xl transition-all ${mode === 'LOGIN' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('SIGNUP'); setError(''); }}
              className={`py-2 rounded-xl transition-all ${mode === 'SIGNUP' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setMode('OTP'); setError(''); }}
              className={`py-2 rounded-xl transition-all ${mode === 'OTP' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
            >
              Mobile OTP
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* MODE 1: LOGIN */}
          {mode === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email or Mobile
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. rahul.sharma@example.com"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* MODE 2: SIGN UP */}
          {mode === 'SIGNUP' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ankit Gupta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. ankit@example.com or +919876543210"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Free Account'}
              </button>
            </form>
          )}

          {/* MODE 3: OTP FLOW */}
          {mode === 'OTP' && (
            <form onSubmit={handleOtpFlow} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {otpSent && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    6-Digit SMS Verification Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-widest text-xl font-black px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white text-slate-900"
                    autoFocus
                  />
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-500">Sent to {emailOrPhone}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode('');
                        setError('');
                        if (typeof window !== 'undefined') {
                          try {
                            (window as any).recaptchaVerifier?.clear();
                          } catch (e) {}
                          (window as any).recaptchaVerifier = null;
                        }
                      }}
                      className="font-bold text-brand-600 hover:text-brand-700 hover:underline"
                    >
                      Change Number / Resend
                    </button>
                  </div>
                </div>
              )}

              {/* Invisible Firebase reCAPTCHA Container */}
              <div id="recaptcha-container" className="flex justify-center" />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {loading ? (otpSent ? 'Verifying Code...' : 'Sending SMS...') : (otpSent ? 'Verify & Continue' : 'Send OTP Code')}
              </button>
            </form>
          )}

          {/* Privacy & Trust note */}
          <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>100% Free • Zero Brokerage • Verified Roommates</span>
          </div>

        </div>

      </div>

      {/* GOOGLE ACCOUNT CHOOSER MODAL (Instant 1-Click Sign-in) */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-modal-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GoogleIcon className="w-6 h-6" />
                <h3 className="text-sm font-bold text-slate-900">Sign in with Google</h3>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Choose a Google account to continue to <strong className="text-slate-800 font-semibold">Shahya</strong>:
            </p>

            {/* Quick One-Click Google Accounts */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleGoogleLogin({
                  name: 'Rahul Sharma',
                  email: 'rahul.sharma@gmail.com',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                })}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all flex items-center gap-3 text-left group"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                  alt="Rahul Sharma"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-brand-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Rahul Sharma</div>
                  <div className="text-[11px] text-slate-500 truncate">rahul.sharma@gmail.com</div>
                </div>
                <Check className="w-4 h-4 text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                type="button"
                onClick={() => handleGoogleLogin({
                  name: 'Priya Patel',
                  email: 'priya.patel@gmail.com',
                  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
                })}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all flex items-center gap-3 text-left group"
              >
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                  alt="Priya Patel"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-brand-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Priya Patel</div>
                  <div className="text-[11px] text-slate-500 truncate">priya.patel@gmail.com</div>
                </div>
                <Check className="w-4 h-4 text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Custom Google Account Form */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Or enter another Google account
              </span>
              <input
                type="text"
                placeholder="Your Name (e.g. Aman Verma)"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="email"
                placeholder="Google Email (e.g. aman@gmail.com)"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                disabled={!customGoogleEmail || googleLoading}
                onClick={() => handleGoogleLogin({
                  name: customGoogleName || customGoogleEmail.split('@')[0],
                  email: customGoogleEmail,
                })}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all disabled:opacity-40"
              >
                {googleLoading ? 'Signing in...' : 'Continue with this Google Account'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading auth...</div>}>
      <LoginContent />
    </Suspense>
  );
}
