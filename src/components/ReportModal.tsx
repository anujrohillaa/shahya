'use client';

import React, { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from './AuthProvider';

interface ReportModalProps {
  listingId?: string;
  reportedUserId?: string;
  title?: string;
  onClose: () => void;
}

export default function ReportModal({ listingId, reportedUserId, title, onClose }: ReportModalProps) {
  const { user } = useAuth();
  const [reason, setReason] = useState('SCAM');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to submit a report');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          reportedUserId,
          reason,
          description,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit report');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Report Submitted</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Thank you for keeping FlatMate safe. Our moderation team will investigate this report promptly.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
              <Flag className="w-5 h-5" />
              <span>Report {listingId ? 'Listing' : 'User'}</span>
            </div>

            {title && (
              <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                Target: {title}
              </p>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Reason for reporting
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="SCAM">Scam / Financial Fraud</option>
                <option value="FAKE_PROPERTY">Fake Property / Stolen Photos</option>
                <option value="ALREADY_RENTED">Property Already Rented / Inactive</option>
                <option value="INCORRECT_INFO">Incorrect Price or Location</option>
                <option value="HARASSMENT">Harassment or Inappropriate Behavior</option>
                <option value="DUPLICATE">Duplicate Listing</option>
                <option value="OTHER">Other Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Please describe what is incorrect or suspicious..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
