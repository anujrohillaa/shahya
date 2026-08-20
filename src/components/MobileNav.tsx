'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Home, Compass, Plus, MessageSquare, User } from 'lucide-react';

export default function MobileNav() {
  const { user, unreadMessagesCount } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1 shadow-lg pb-safe">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
            isActive('/') && pathname === '/' ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* Explore */}
        <Link
          href="/explore"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
            isActive('/explore') ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Explore</span>
        </Link>

        {/* Floating Post Button */}
        <Link
          href="/post"
          className="flex flex-col items-center justify-center -mt-5 group"
        >
          <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 group-active:scale-95 transition-transform">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-semibold text-brand-700 mt-1">Post</span>
        </Link>

        {/* Chats with live badge */}
        <Link
          href="/messages"
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
            isActive('/messages') ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 mb-0.5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Chats</span>
        </Link>

        {/* Profile */}
        <Link
          href={user ? "/dashboard" : "/login"}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
            isActive('/dashboard') || isActive('/profile') || isActive('/login')
              ? 'text-brand-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{user ? 'Account' : 'Login'}</span>
        </Link>

      </div>
    </div>
  );
}
