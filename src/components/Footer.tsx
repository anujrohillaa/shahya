import React from 'react';
import Link from 'next/link';
import { Home, ShieldCheck, Heart, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-20 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 pb-10 border-b border-slate-800">
          
          {/* Col 1: Platform Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="bg-white px-3.5 py-2.5 rounded-2xl shadow-md border border-slate-100/90 group-hover:scale-102 transition-transform inline-flex items-center">
                <img
                  src="/logo.png"
                  alt="Shahya - Find Rooms, Flats & Flatmates for Free"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Find Rooms, Flats & Flatmates for Free. Connect directly with verified roommates, chat instantly, and find your next home with zero brokerage.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Free • No Brokerage</span>
            </div>
          </div>

          {/* Col 2: Top Locations */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3.5">Top Cities</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/explore?city=Gurgaon" className="hover:text-white transition-colors">
                  Rooms in Gurgaon
                </Link>
              </li>
              <li>
                <Link href="/explore?city=Bangalore" className="hover:text-white transition-colors">
                  Rooms in Bangalore
                </Link>
              </li>
              <li>
                <Link href="/explore?city=Delhi" className="hover:text-white transition-colors">
                  Rooms in Delhi
                </Link>
              </li>
              <li>
                <Link href="/explore?city=Noida" className="hover:text-white transition-colors">
                  Rooms in Noida
                </Link>
              </li>
              <li>
                <Link href="/explore?city=Pune" className="hover:text-white transition-colors">
                  Rooms in Pune
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3.5">Discovery</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/explore?type=HAVE_PLACE&roomType=PRIVATE_ROOM" className="hover:text-white transition-colors">
                  Private Rooms in Shared Flats
                </Link>
              </li>
              <li>
                <Link href="/explore?type=NEED_PLACE" className="hover:text-white transition-colors">
                  Flatmate Seekers
                </Link>
              </li>
              <li>
                <Link href="/explore?gender=FEMALE" className="hover:text-white transition-colors">
                  Female-Only Accommodations
                </Link>
              </li>
              <li>
                <Link href="/explore?gender=MALE" className="hover:text-white transition-colors">
                  Male-Only Accommodations
                </Link>
              </li>
              <li>
                <Link href="/post" className="hover:text-brand-400 font-medium transition-colors flex items-center gap-1">
                  Post for Free <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Safety & Support */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3.5">Shahya Trust</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              We never charge contact unlock fees. Always visit the accommodation and verify housemates before sending any token money.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <span className="font-semibold text-white block mb-0.5">Zero Commission</span>
              Free direct chat between tenants, room seekers, and hosts across India.
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Shahya.com — All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/explore" className="hover:text-slate-400">Explore</Link>
            <Link href="/post" className="hover:text-slate-400">Post Listing</Link>
            <Link href="/admin" className="hover:text-amber-400">Admin</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
