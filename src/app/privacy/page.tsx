import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Shahya',
  description: 'Learn how Shahya collects, encrypts, uses, and protects your personal information, phone numbers, and messages.',
};

export default function PrivacyPage() {
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
        
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: August 2026 • Compliant with India Digital Personal Data Protection (DPDP) Act
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Overview & Commitment</h2>
            <p>
              Shahya ("we", "our", or "us") respects your privacy. We are committed to protecting the personal data of all users who browse, post, or communicate on our platform. We <strong>never sell your personal data or phone number</strong> to third-party telemarketers or real estate brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Information We Collect</h2>
            <p>We only collect information necessary to facilitate peer-to-peer flatmate matching and secure communication:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Authentication Data</strong>: Mobile phone number (verified via Firebase SMS OTP), or Google Account name and email (via OAuth).</li>
              <li><strong>Profile Information</strong>: Name, age, gender, occupation, college/company, short bio, and lifestyle preferences (diet, smoking, sleep routine, pets).</li>
              <li><strong>Listing Data</strong>: Room details, property specifications, rent, locality, photos, and amenities.</li>
              <li><strong>In-App Messages</strong>: Messages sent through our built-in real-time chat service to enable direct room discussions.</li>
              <li><strong>Technical Data</strong>: Device type, browser headers, and IP address for fraud detection and spam prevention.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">3. How We Use Your Information</h2>
            <p>Your data is used strictly for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Displaying your listings and public seeker profile to prospective flatmates.</li>
              <li>Calculating lifestyle compatibility scores between flatmate seekers and hosts.</li>
              <li>Delivering real-time direct chat messages.</li>
              <li>Moderating abusive content and preventing scam listings.</li>
              <li>Maintaining system security and service availability.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Data Sharing & Third Parties</h2>
            <p>
              We do not sell, rent, or trade your personal data. Limited sharing occurs only with essential infrastructure providers:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Authentication</strong>: Google Firebase for SMS OTP verification and Google Identity.</li>
              <li><strong>Cloud Storage & Database</strong>: Supabase (PostgreSQL) hosted in encrypted AWS Asia-Pacific (Mumbai) data centers.</li>
              <li><strong>Hosting & CDN</strong>: Vercel edge infrastructure with HTTPS encryption in transit and at rest.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Cookies & Local Storage</h2>
            <p>
              We use secure HTTP-only cookies and browser `localStorage` strictly to maintain your authenticated login session across page refreshes. We do not use intrusive cross-site tracking cookies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">6. User Rights & Data Deletion</h2>
            <p>
              Under applicable data protection laws (including the India DPDP Act), you have the right to access, rectify, download, or permanently erase your personal data.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Want to delete your account and listings?</span>
              <p className="text-xs text-slate-600">
                You can permanently delete all your data with 1-click via our <Link href="/delete-data" className="text-brand-600 underline font-bold">Data Deletion Request Page</Link>.
              </p>
            </div>
          </section>

          <section className="space-y-2 border-t border-slate-100 pt-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">7. Contact & Privacy Inquiries</h2>
            <p>
              For any questions, grievances, or privacy inquiries, contact our Privacy & Support Team directly on WhatsApp at <strong>+91 9817283155</strong> or submit an inquiry on our <Link href="/contact" className="text-brand-600 underline font-semibold">Contact Page</Link>.
            </p>
            <p className="text-xs text-slate-500 pt-1">
              <strong>Registered Office:</strong> Dhigana, Jind, Haryana - 126114, India.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
