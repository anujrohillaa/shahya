import React from 'react';
import Link from 'next/link';
import { Home, ShieldCheck, Heart, Sparkles, MessageCircle, ArrowRight, Lock, FileText, Trash2, Mail, Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-10 border-b border-slate-800">
          
          {/* Col 1: Platform Brand & Trust */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <div className="bg-white px-3.5 py-2 rounded-2xl shadow-md border border-slate-100/90 group-hover:scale-102 transition-transform inline-flex items-center">
                <img
                  src="/logo.png"
                  alt="Shahya - Zero Brokerage Flatmate Finder"
                  className="h-9 sm:h-11 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              India's direct, zero-brokerage room & flatmate discovery network. Connect with verified roommates, chat for free, and move into your dream home.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Free • Zero Brokerage</span>
            </div>
          </div>

          {/* Col 2: Top Locations */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3.5">Top Cities</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/rooms/manesar" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Rooms in Manesar (IMT)</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-900 text-brand-300">Hot</span>
                </Link>
              </li>
              <li>
                <Link href="/rooms/gurgaon" className="hover:text-white transition-colors">
                  Rooms in Gurgaon
                </Link>
              </li>
              <li>
                <Link href="/rooms/delhi" className="hover:text-white transition-colors">
                  Rooms in Delhi (NCR)
                </Link>
              </li>
              <li>
                <Link href="/rooms/noida" className="hover:text-white transition-colors">
                  Rooms in Noida
                </Link>
              </li>
              <li>
                <Link href="/rooms/bangalore" className="hover:text-white transition-colors">
                  Rooms in Bangalore
                </Link>
              </li>
              <li>
                <Link href="/rooms/pune" className="hover:text-white transition-colors">
                  Rooms in Pune
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Discovery */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3.5">Company & Help</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  <span>About Shahya</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>Contact Support</span>
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  Browse All Listings
                </Link>
              </li>
              <li>
                <Link href="/explore?type=NEED_PLACE" className="hover:text-white transition-colors">
                  Flatmate Seekers
                </Link>
              </li>
              <li>
                <Link href="/post" className="hover:text-brand-400 font-bold text-brand-400 transition-colors flex items-center gap-1">
                  <span>Post Room for Free</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Data Privacy */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3.5">Legal & Privacy</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/delete-data" className="hover:text-rose-400 text-slate-400 transition-colors flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5 text-rose-500/80" />
                  <span>Data Deletion Request</span>
                </Link>
              </li>
              <li className="pt-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-slate-200 block mb-0.5">DPDP Compliant</strong>
                  Your personal data is encrypted and never sold to third-party telemarketers.
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Shahya.com — India's Free Flatmate Network. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <span>•</span>
            <Link href="/delete-data" className="hover:text-rose-400 transition-colors">Delete Data</Link>
            <span>•</span>
            <Link href="/llms.txt" className="hover:text-white transition-colors">AI Docs (llms.txt)</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
