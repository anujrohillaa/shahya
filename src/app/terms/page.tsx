import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Shahya',
  description: 'Terms of Service, community rules, and listing guidelines for using the Shahya zero-brokerage flatmate network.',
};

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: August 2026 • Effective for all Shahya users across India
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or using Shahya (accessible via shahya.com or related web applications), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you must discontinue use of the platform immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Zero Brokerage & Platform Role</h2>
            <p>
              Shahya operates as an independent peer-to-peer technology platform that connects accommodation hosts, room owners, and room seekers. 
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Shahya is <strong>not a real estate broker</strong>, agent, or property manager.</li>
              <li>We charge <strong>zero brokerage commission</strong> and zero fees for direct messaging between users.</li>
              <li>Rental agreements, deposits, and tenancy contracts are entered into directly between the respective users.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">3. User Accounts & Verification</h2>
            <p>
              To post a listing, message roommates, or save properties, you must authenticate using your mobile number (OTP) or Google OAuth. You agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Provide accurate, current, and genuine personal details and contact numbers.</li>
              <li>Maintain the confidentiality of your authentication credentials.</li>
              <li>Immediately report any unauthorized access to your account.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Listing Guidelines & Content Accuracy</h2>
            <p>
              Users posting room vacancies or flatmate seeker requests warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>All photos uploaded are authentic representations of the actual property or room.</li>
              <li>Rent amounts, utility estimates, and security deposit details are transparent and truthful.</li>
              <li>No discriminatory, abusive, fraudulent, or unlawful listings are published.</li>
              <li>Commercial broker spam is strictly prohibited and subject to immediate permanent ban without notice.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Safety & Cautionary Advice</h2>
            <p>
              While Shahya employs phone verification, content moderation, and spam detection algorithms, users must exercise due diligence:
            </p>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
              <strong>Important Safety Rule:</strong> Never transfer token money, advance rent, or security deposits without visiting the property physically, meeting the roommates, and verifying valid identification and rental authority.
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">6. Limitation of Liability</h2>
            <p>
              Shahya shall not be liable for any direct, indirect, incidental, or consequential disputes arising out of tenancy agreements, personal interactions, financial transactions between users, or property condition discrepancies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">7. Termination & Account Deletion</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate community rules or post spam. Users may permanently delete their account and personal data at any time via the <Link href="/delete-data" className="text-brand-600 underline font-semibold">Data Deletion Request</Link> page.
            </p>
          </section>

          <section className="space-y-2 border-t border-slate-100 pt-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">8. Contact & Registered Office</h2>
            <p>
              If you have any questions regarding these Terms, please contact our support team directly via WhatsApp on <strong>+91 9817283155</strong> or visit our <Link href="/contact" className="text-brand-600 underline font-semibold">Contact Page</Link>.
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
