'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Home, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import { ListingItem } from '@/lib/types';

export default function CityRoomsPage() {
  const params = useParams<{ city: string }>();
  const cityName = decodeURIComponent(params.city || 'Gurgaon');
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCityListings() {
      try {
        const res = await fetch(`/api/listings?city=${cityName}&type=HAVE_PLACE&status=ACTIVE`);
        if (res.ok) {
          const data = await res.json();
          setListings(data.listings || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCityListings();
  }, [cityName]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20 text-brand-300">
          <MapPin className="w-3.5 h-3.5" />
          <span>{cityName} Shared Accommodations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Rooms for Rent in {cityName} — Zero Brokerage
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Browse verified private rooms, master bedrooms, and shared flats in {cityName}. Chat directly with roommates and owners for free.
        </p>
      </div>

      {/* Listings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Available Rooms in {cityName} ({listings.length})
          </h2>
          <Link
            href={`/explore?city=${cityName}`}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View with Filters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-sm text-slate-500 space-y-3">
            <p>No listings currently found in {cityName}. Be the first to post a room!</p>
            <Link href="/post" className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs">
              Post Your Room for Free
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(l => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
