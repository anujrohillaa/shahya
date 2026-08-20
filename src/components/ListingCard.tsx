'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ListingItem } from '@/lib/types';
import { useAuth } from './AuthProvider';
import {
  MapPin,
  Heart,
  ShieldCheck,
  Calendar,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { calculateMatchScore } from '@/lib/matching';

interface ListingCardProps {
  listing: ListingItem;
  onSaveToggle?: (listingId: string, saved: boolean) => void;
}

export default function ListingCard({ listing, onSaveToggle }: ListingCardProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(listing.isSaved || false);
  const [saving, setSaving] = useState(false);

  const matchScore = listing.matchScore || calculateMatchScore(user, listing);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    setSaving(true);
    const newSaved = !isSaved;
    setIsSaved(newSaved);

    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id }),
      });
      if (res.ok) {
        onSaveToggle?.(listing.id, newSaved);
      } else {
        setIsSaved(!newSaved);
      }
    } catch (err) {
      setIsSaved(!newSaved);
    } finally {
      setSaving(false);
    }
  };

  const coverPhoto = listing.photos?.find(p => p.isCover)?.url || listing.photos?.[0]?.url || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80';
  const poster = listing.user;
  const isHavePlace = listing.type === 'HAVE_PLACE';

  const formatRent = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const propertyTypeLabel = (pType?: string | null, rType?: string | null) => {
    if (rType === 'PRIVATE_ROOM') return 'Private Room';
    if (rType === 'SHARED_ROOM') return 'Shared Room';
    if (rType === 'ENTIRE_PROPERTY') return 'Entire Flat';
    if (pType === 'APARTMENT') return 'Apartment';
    if (pType === 'BUILDER_FLOOR') return 'Builder Floor';
    if (pType === 'PG') return 'PG Room';
    return isHavePlace ? 'Room in Flat' : 'Seeking Room';
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-card hover:shadow-floating transition-all duration-300 flex flex-col h-full relative">
      
      {/* Top Image Container */}
      <Link href={`/listing/${listing.id}`} className="relative aspect-[16/10] overflow-hidden bg-slate-100 block">
        <img
          src={coverPhoto}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase shadow-sm pointer-events-auto backdrop-blur-md whitespace-nowrap ${
            isHavePlace 
              ? 'bg-slate-900/85 text-white border border-white/20' 
              : 'bg-brand-600/90 text-white border border-brand-400/30'
          }`}>
            {isHavePlace ? '🏠 Place Available' : '🔍 Seeking Flatmate'}
          </span>

          {/* Save Heart Button */}
          <button
            onClick={handleHeartClick}
            disabled={saving}
            className={`w-8 h-8 rounded-full flex items-center justify-center pointer-events-auto backdrop-blur-md transition-all shadow-md active:scale-90 ${
              isSaved 
                ? 'bg-rose-500 text-white' 
                : 'bg-white/85 hover:bg-white text-slate-700 hover:text-rose-500'
            }`}
            title={isSaved ? "Remove from saved" : "Save listing"}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Price Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-3 pt-8 flex items-end justify-between text-white">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-lg sm:text-xl font-black tracking-tight whitespace-nowrap">
                {isHavePlace ? formatRent(listing.rent) : `₹${(listing.minBudget || 10000).toLocaleString('en-IN')} - ₹${(listing.maxBudget || 15000).toLocaleString('en-IN')}`}
              </span>
              <span className="text-[11px] text-slate-300 font-normal">/mo</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1 whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" /> Zero Brokerage
            </span>
          </div>

          {/* Compatibility score pill */}
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/90 text-white backdrop-blur-md border border-indigo-300/30 shadow-xs whitespace-nowrap flex-shrink-0">
            <Sparkles className="w-3 h-3 text-amber-300 flex-shrink-0" />
            <span>{matchScore}% Match</span>
          </div>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        
        <div className="space-y-1">
          {/* Room type & BHK specs */}
          <div className="flex items-center justify-between text-[11px] font-bold text-brand-600 whitespace-nowrap">
            <span className="truncate">{propertyTypeLabel(listing.propertyType, listing.roomType)}</span>
            {listing.bedrooms && (
              <span className="text-slate-400 font-medium ml-1 flex-shrink-0">{listing.bedrooms} BHK</span>
            )}
          </div>

          {/* Title */}
          <Link href={`/listing/${listing.id}`} className="block">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-brand-600 transition-colors">
              {listing.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate">{listing.locality}, {listing.city}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between gap-2">
          
          {/* Poster info */}
          {poster ? (
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <img
                src={poster.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${poster.name}`}
                alt={poster.name}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-200"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-slate-800 truncate whitespace-nowrap">
                    {poster.name.split(' ')[0]}{poster.age ? `, ${poster.age}` : ''}
                  </span>
                  {poster.isPhoneVerified && (
                    <span title="Phone Verified" className="flex-shrink-0">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 truncate block whitespace-nowrap">
                  {poster.occupation === 'WORKING_PROFESSIONAL' ? 'Professional' : poster.occupation === 'STUDENT' ? 'Student' : 'Resident'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400">Verified Member</div>
          )}

          {/* Move-in badge */}
          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 flex items-center gap-1 flex-shrink-0 whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
            <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span>{listing.moveInImmediate ? 'Immediate' : 'Available'}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
