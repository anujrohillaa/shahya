'use client';

import React from 'react';
import { Home, Sparkles } from 'lucide-react';

/**
 * 1. Brand Pulse Loader (Centered animated house with glowing rings)
 */
export function ShahyaPulseLoader({
  message = 'Finding verified rooms & flatmates...',
  size = 'md'
}: {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const iconSizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const houseSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Animated Ripple Wave 1 */}
        <div className="absolute w-20 h-20 rounded-full bg-brand-500/15 animate-ping" />
        
        {/* Animated Ripple Wave 2 */}
        <div className="absolute w-16 h-16 rounded-full bg-brand-600/20 animate-pulse" />

        {/* Central Logo Box */}
        <div className={`${iconSizes[size]} rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/25 relative z-10 animate-bounce`}>
          <Home className={houseSizes[size]} />
        </div>
      </div>

      {/* Loading message & bouncing dots */}
      <div className="space-y-1.5 pt-2">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-xs sm:text-sm font-extrabold bg-gradient-to-r from-brand-900 via-brand-700 to-indigo-600 bg-clip-text text-transparent">
            Shahya
          </span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce" />
          </div>
        </div>

        {message && (
          <p className="text-xs text-slate-400 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * 2. Full Page Loader
 */
export function FullPageLoader({ message }: { message?: string }) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center w-full">
      <ShahyaPulseLoader message={message} size="md" />
    </div>
  );
}

/**
 * 3. Shimmer Skeleton for Single Listing Card
 */
export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-card flex flex-col h-full relative">
      {/* Photo skeleton */}
      <div className="relative aspect-[16/10] bg-slate-200/80 animate-pulse overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
        <div className="absolute top-2.5 left-2.5 w-24 h-5 rounded-full bg-slate-300/80" />
        <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-300/80" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="w-20 h-3.5 rounded-md bg-slate-200 animate-pulse" />
            <div className="w-12 h-3.5 rounded-md bg-slate-200 animate-pulse" />
          </div>
          <div className="w-4/5 h-4 rounded-md bg-slate-200 animate-pulse" />
          <div className="w-1/2 h-3.5 rounded-md bg-slate-200 animate-pulse" />
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse" />
            <div className="w-16 h-3 rounded-md bg-slate-200 animate-pulse" />
          </div>
          <div className="w-16 h-4 rounded-md bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * 4. Shimmer Skeleton for Listing Grid
 */
export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 5. Listing Detail Page Shimmer Skeleton
 */
export function ListingDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse">
      {/* Top breadcrumb */}
      <div className="flex justify-between items-center">
        <div className="w-20 h-6 bg-slate-200 rounded-xl" />
        <div className="flex gap-2">
          <div className="w-16 h-8 bg-slate-200 rounded-xl" />
          <div className="w-16 h-8 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* Gallery skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-72 sm:h-96">
        <div className="md:col-span-2 bg-slate-200 rounded-3xl h-full" />
        <div className="hidden md:grid grid-rows-2 gap-3 h-full">
          <div className="bg-slate-200 rounded-3xl" />
          <div className="bg-slate-200 rounded-3xl" />
        </div>
      </div>

      {/* Details skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="w-3/4 h-8 bg-slate-200 rounded-xl" />
          <div className="w-1/3 h-5 bg-slate-200 rounded-xl" />
          <div className="h-40 bg-slate-200 rounded-3xl" />
        </div>
        <div className="h-64 bg-slate-200 rounded-3xl" />
      </div>
    </div>
  );
}

/**
 * 6. Chat Messages Shimmer Skeleton
 */
export function ChatSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse w-full max-w-xl mx-auto">
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
        <div className="w-48 h-12 bg-slate-200 rounded-2xl rounded-tl-sm" />
      </div>

      <div className="flex items-start justify-end gap-2.5">
        <div className="w-56 h-14 bg-brand-200/80 rounded-2xl rounded-tr-sm" />
      </div>

      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
        <div className="w-64 h-16 bg-slate-200 rounded-2xl rounded-tl-sm" />
      </div>
    </div>
  );
}
