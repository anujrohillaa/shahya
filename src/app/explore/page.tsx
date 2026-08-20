'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Home,
  Users,
  X,
  RotateCcw,
  Check,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import { ListingGridSkeleton } from '@/components/ui/CustomLoader';
import { ListingItem } from '@/lib/types';

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter states initialized from URL
  const [type, setType] = useState(searchParams.get('type') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [minRent, setMinRent] = useState(searchParams.get('minRent') || '');
  const [maxRent, setMaxRent] = useState(searchParams.get('maxRent') || '30000');
  const [gender, setGender] = useState(searchParams.get('gender') || 'ANY');
  const [roomType, setRoomType] = useState(searchParams.get('roomType') || 'ALL');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'ALL');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch listings whenever search params change
  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      if (city) params.set('city', city);
      if (q) params.set('q', q);
      if (minRent) params.set('minRent', minRent);
      if (maxRent && maxRent !== '50000') params.set('maxRent', maxRent);
      if (gender && gender !== 'ANY') params.set('gender', gender);
      if (roomType && roomType !== 'ALL') params.set('roomType', roomType);
      if (propertyType && propertyType !== 'ALL') params.set('propertyType', propertyType);
      if (sort) params.set('sort', sort);

      try {
        const res = await fetch(`/api/listings?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setListings(data.listings || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [type, city, q, minRent, maxRent, gender, roomType, propertyType, sort]);

  const handleResetFilters = () => {
    setType('');
    setCity('');
    setQ('');
    setMinRent('');
    setMaxRent('30000');
    setGender('ANY');
    setRoomType('ALL');
    setPropertyType('ALL');
    setSort('newest');
    router.push('/explore');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6 pb-24 min-h-[calc(100dvh-4rem)] flex flex-col justify-between">
      
      <div className="space-y-4">
        
        {/* Top Search & Filter Bar */}
        <div className="bg-white p-2.5 sm:p-4 rounded-3xl shadow-card border border-slate-200/80 space-y-3">
          
          {/* Search input + city dropdown + mobile filter button */}
          <div className="flex items-center gap-2">
            
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search locality (e.g. Sector 43, Indiranagar)..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-9 pr-7 py-2 sm:py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 truncate"
              />
              {q && (
                <button
                  onClick={() => setQ('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-2 py-2 sm:px-3 sm:py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 flex-shrink-0 whitespace-nowrap"
            >
              <option value="">All Cities</option>
              <option value="Gurgaon">Gurgaon</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Delhi">Delhi</option>
              <option value="Noida">Noida</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
            </select>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-2.5 py-2 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
              <span>Filters</span>
            </button>

          </div>

          {/* Mode Switcher Tabs & Sort Dropdown */}
          <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 flex-wrap">
            
            {/* Mode tabs - scrollable on very narrow screens */}
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 text-[11px] sm:text-xs font-bold overflow-x-auto no-scrollbar max-w-full">
              <button
                onClick={() => setType('')}
                className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all whitespace-nowrap ${
                  type === '' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setType('HAVE_PLACE')}
                className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${
                  type === 'HAVE_PLACE' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Home className="w-3 h-3 text-brand-600" />
                <span>Rooms & Flats</span>
              </button>
              <button
                onClick={() => setType('NEED_PLACE')}
                className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${
                  type === 'NEED_PLACE' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3 h-3 text-purple-600" />
                <span>Flatmates</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 font-medium whitespace-nowrap">
              <span>Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-2 py-1 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 text-[11px] sm:text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="newest">Newest</option>
                <option value="rent_asc">Rent: Low to High</option>
                <option value="rent_desc">Rent: High to Low</option>
                <option value="views">Popular</option>
              </select>
            </div>

          </div>

        </div>


        {/* MAIN RESULTS GRID WITH DESKTOP FILTERS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
          
          {/* DESKTOP FILTERS SIDEBAR */}
          <div className="hidden lg:block lg:col-span-1 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-5 sticky top-20">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                <span>Filters</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Budget Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Max Monthly Rent</span>
                <span className="text-brand-600 text-sm font-extrabold whitespace-nowrap">₹{parseInt(maxRent).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="45000"
                step="1000"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                className="w-full accent-brand-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>₹5,000</span>
                <span>₹45,000+</span>
              </div>
            </div>

            {/* Gender Preference */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Flatmate Gender
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Any', val: 'ANY' },
                  { label: 'Male', val: 'MALE' },
                  { label: 'Female', val: 'FEMALE' },
                ].map((g) => (
                  <button
                    key={g.val}
                    type="button"
                    onClick={() => setGender(g.val)}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      gender === g.val
                        ? 'bg-brand-50 border-brand-500 text-brand-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Room Type
              </label>
              <div className="space-y-1 text-xs">
                {[
                  { label: 'All Room Types', val: 'ALL' },
                  { label: 'Private Room', val: 'PRIVATE_ROOM' },
                  { label: 'Shared Room', val: 'SHARED_ROOM' },
                  { label: 'Entire Property', val: 'ENTIRE_PROPERTY' },
                ].map((r) => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => setRoomType(r.val)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                      roomType === r.val ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{r.label}</span>
                    {roomType === r.val && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>

          </div>


          {/* LISTINGS RESULTS GRID */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Status Header */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
              <span className="truncate">
                Showing <strong className="text-slate-900">{listings.length}</strong> listings
                {city && ` in ${city}`}
              </span>
              <span className="text-emerald-600 font-bold flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" /> Free to Chat
              </span>
            </div>

            {/* Results Grid */}
            {loading ? (
              <ListingGridSkeleton count={6} />
            ) : listings.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-card space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto shadow-xs">
                  <Home className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">No listings found matching your search</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    {city ? `No active listings found in ${city} right now. ` : ''}
                    Meanwhile, you can be the first one to post a room or create a flatmate seeker profile! It takes under 2 minutes and is 100% free.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <Link
                    href="/post"
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Post Free Room or Flatmate Request</span>
                  </Link>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {listings.map((listing, idx) => (
                  <React.Fragment key={listing.id}>
                    <ListingCard listing={listing} />
                    
                    {idx === 4 && (
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-100 to-indigo-50/50 border border-dashed border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                            Sponsored
                          </span>
                          <span>Need furniture or high-speed Wi-Fi for your new flat?</span>
                        </div>
                        <a
                          href="#partner"
                          className="font-bold text-brand-600 hover:text-brand-700 whitespace-nowrap"
                        >
                          Explore Partner Discounts →
                        </a>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>


      {/* MOBILE FILTER MODAL BOTTOM SHEET */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end lg:hidden animate-in fade-in">
          <div className="bg-white rounded-t-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-5 animate-in slide-in-from-bottom-10">
            
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Filter Listings</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Budget */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Max Monthly Rent</span>
                <span className="text-brand-600 text-sm font-extrabold whitespace-nowrap">₹{parseInt(maxRent).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="45000"
                step="1000"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                className="w-full accent-brand-600"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Flatmate Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Any', val: 'ANY' },
                  { label: 'Male', val: 'MALE' },
                  { label: 'Female', val: 'FEMALE' },
                ].map((g) => (
                  <button
                    key={g.val}
                    type="button"
                    onClick={() => setGender(g.val)}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      gender === g.val
                        ? 'bg-brand-50 border-brand-500 text-brand-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Room Type
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white"
              >
                <option value="ALL">All Room Types</option>
                <option value="PRIVATE_ROOM">Private Room</option>
                <option value="SHARED_ROOM">Shared Room</option>
                <option value="ENTIRE_PROPERTY">Entire Property</option>
              </select>
            </div>

            <div className="pt-3 flex items-center gap-2.5">
              <button
                onClick={handleResetFilters}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-2/3 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-slate-400 min-h-[80vh]">Loading discovery hub...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
