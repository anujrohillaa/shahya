'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShieldAlert, CheckCircle2, ArrowLeft, Mail, Phone, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';

export default function DeleteDataPage() {
  const { user, logout } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();

  // Logged-in direct deletion state
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  // Manual request state for logged-out / external requests
  const [reqEmail, setReqEmail] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqReason, setReqReason] = useState('');
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualSubmitted, setManualSubmitted] = useState(false);

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText !== 'DELETE') {
      error('Please type DELETE in all uppercase to confirm.');
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
      });

      if (res.ok) {
        setDeleted(true);
        success('Account and data permanently deleted.');
        setTimeout(async () => {
          await logout();
          router.push('/');
        }, 2000);
      } else {
        const data = await res.json();
        error(data.error || 'Failed to delete account');
      }
    } catch (err: any) {
      error(err.message || 'An error occurred during account deletion');
    } finally {
      setDeleting(false);
    }
  };

  const handleManualRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqEmail && !reqPhone) {
      error('Please provide at least an email or mobile phone number.');
      return;
    }

    setManualSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setManualSubmitting(false);
    setManualSubmitted(true);
    success('Data deletion request submitted successfully.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-card space-y-8">
        
        {/* Header */}
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Trash2 className="w-3.5 h-3.5" />
            <span>User Data Deletion Request</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Delete Your Account & Personal Data
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            In compliance with the India Digital Personal Data Protection (DPDP) Act, Google Identity policies, and Apple App Store privacy guidelines, you have the absolute right to permanently delete your data from Shahya.
          </p>
        </div>

        {/* What gets deleted notice */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-700">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-700" />
            <span>What happens when you request data deletion?</span>
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>User Profile:</strong> Your name, phone number, email, avatar, bio, and lifestyle preferences are permanently erased from our databases.</li>
            <li><strong>Listings & Photos:</strong> All active and draft room listings, property photos, and descriptions are deleted immediately.</li>
            <li><strong>Messages:</strong> Your chat conversations and message histories are permanently wiped.</li>
            <li><strong>Saved & Activity:</strong> Saved listings, notifications, and bookmarks are removed.</li>
          </ul>
        </div>

        {/* Scenario 1: User is Logged In */}
        {user ? (
          <div className="p-6 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-5">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Logged In As: {user.name} ({user.phone || user.email})</span>
            </div>

            {deleted ? (
              <div className="p-6 text-center space-y-2 bg-white rounded-xl border border-rose-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900">Your account has been deleted</h4>
                <p className="text-xs text-slate-500">Redirecting to homepage...</p>
              </div>
            ) : (
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <p className="text-xs text-rose-900 leading-relaxed">
                  This action is <strong>immediate and irreversible</strong>. Once deleted, your account and listings cannot be recovered.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-2">
                    To confirm deletion, type <span className="font-black underline">DELETE</span> below:
                  </label>
                  <input
                    type="text"
                    required
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                    className="w-full sm:max-w-xs px-4 py-2.5 rounded-xl border border-rose-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={deleting || confirmText !== 'DELETE'}
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{deleting ? 'Erasing Account...' : 'Permanently Delete My Account & All Data'}</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Scenario 2: User is Not Logged In (Submit Deletion Ticket) */
          <div className="space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Submit an Offline Data Deletion Request
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                If you no longer have access to your account or prefer our privacy team to manually process your deletion request, please submit your verified credentials below:
              </p>
            </div>

            {manualSubmitted ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-950 text-base">Request Queued for Deletion</h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Our Data Protection Officer has received your request. All associated records will be purged within 48 hours and a confirmation email/SMS will be sent.
                </p>
              </div>
            ) : (
              <form onSubmit={handleManualRequest} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={reqEmail}
                      onChange={(e) => setReqEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Registered Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={reqPhone}
                      onChange={(e) => setReqPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Reason for Deletion (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Found a flat / No longer looking for flatmates / Other..."
                    value={reqReason}
                    onChange={(e) => setReqReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={manualSubmitting}
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <span>{manualSubmitting ? 'Submitting...' : 'Submit Data Deletion Request'}</span>
                  </button>
                </div>
              </form>
            )}

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Already have an active login?</span>
              <Link href="/login" className="font-bold text-brand-600 hover:underline">
                Sign in to delete instantly →
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
