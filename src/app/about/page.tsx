import React from 'react';
import Link from 'next/link';
import { Home, Users, ShieldCheck, Heart, Sparkles, ArrowRight, Zap, Award, Smile } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Shahya — The Zero Brokerage Flatmate Movement',
  description: 'Learn about Shahya’s mission to eliminate broker commissions and make finding rooms and flatmates in India transparent, free, and effortless.',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12 pb-24">
      
      {/* Hero Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Story & Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Finding a flatmate shouldn't cost you half a month's salary.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Shahya was born out of frustration with predatory real estate brokers, fake listings, and portals charging ₹2,000+ just to unlock a phone number. We built a platform where house-hunting is 100% free, direct, and transparent.
        </p>
      </div>

      {/* 3 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Zero Brokerage Forever</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            No broker commissions, zero hidden fees, and zero paid contact locks. Direct peer-to-peer connection is a fundamental right.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Lifestyle Matching</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A great room with the wrong roommate is a nightmare. We match people based on diet, sleep schedule, cleanliness, and work routines.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Direct In-App Chat</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Message prospective flatmates instantly. Share room details, schedule flat visits, and finalize flat shares with zero friction.
          </p>
        </div>

      </div>

      {/* Story Section */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Why Shahya Exists</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Built by professionals who moved to new cities and experienced the pain firsthand.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Whether moving to IMT Manesar for an automotive engineering job, relocating to Cyber City Gurgaon for a tech startup, or coming to Delhi University for college, finding clean, affordable shared housing has historically been overwhelming.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Shahya provides an open, modern community where you can browse authentic 16:9 room photos, view verified profiles, and team up with fellow room seekers to rent beautiful apartments together.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-slate-800">
          <Link
            href="/explore"
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            Explore Rooms & Flatmates
          </Link>
          <Link
            href="/post"
            className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all"
          >
            Post a Free Listing
          </Link>
        </div>
      </div>

    </div>
  );
}
