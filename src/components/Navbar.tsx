'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import {
  Home,
  PlusCircle,
  MessageSquare,
  Heart,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Users
} from 'lucide-react';

export default function Navbar() {
  const { user, unreadMessagesCount, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const avatarMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click / tap
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 glass">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-shrink-0">
          <Link href="/" className="flex items-center group py-1">
            <img
              src="/logo.png"
              alt="Shahya - Find Rooms, Flats & Flatmates for Free"
              className="h-11 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/explore"
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                isActive('/explore')
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Explore
            </Link>
            <Link
              href="/explore?type=HAVE_PLACE"
              className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
            >
              Find a Place
            </Link>
            <Link
              href="/explore?type=NEED_PLACE"
              className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-brand-500" />
              <span>Flatmates</span>
            </Link>
          </nav>
        </div>

        {/* Right Section / Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Post Listing CTA (Desktop) */}
          <Link
            href="/post"
            className="hidden md:flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-xs transition-all hover:scale-102 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post for Free</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Messages live icon (Desktop) */}
              <Link
                href="/messages"
                className="hidden md:flex relative p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                title="Messages"
              >
                <MessageSquare className="w-5 h-5" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-brand-600 text-white text-[9px] font-bold flex items-center justify-center ring-1.5 ring-white">
                    {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                  </span>
                )}
              </Link>

              {/* Saved (Desktop) */}
              <Link
                href="/dashboard?tab=saved"
                className="hidden md:flex p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                title="Saved Listings"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* User Avatar Menu (Mobile & Desktop) */}
              <div ref={avatarMenuRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-1.5 ring-brand-500/20"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 sm:w-60 bg-white rounded-2xl shadow-floating border border-slate-100 py-1.5 z-50 animate-in fade-in">
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email || user.phone}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>My Dashboard</span>
                      </Link>
                      <Link
                        href={`/profile/${user.id}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Public Profile</span>
                      </Link>
                      <Link
                        href="/dashboard?tab=saved"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        <span>Saved Listings</span>
                      </Link>

                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 my-1"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Admin Moderation</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => { logout(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 px-3.5 py-1.5 rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap"
            >
              Log in
            </Link>
          )}

        </div>

      </div>
    </header>
  );
}
