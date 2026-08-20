'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Home,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Flame,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import { ListingGridSkeleton } from '@/components/ui/CustomLoader';
import { ListingItem } from '@/lib/types';

import JsonLd, { getFaqSchema } from '@/components/JsonLd';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [latestListings, setLatestListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const router = useRouter();

  const cities = [
    { name: 'Gurgaon', count: '480+ places', image: '/cities/gurugram.webp' },
    { name: 'Manesar', count: '190+ places', image: '/cities/manesar.webp' },
    { name: 'Delhi', count: '410+ places', image: '/cities/delhi.webp' },
    { name: 'Noida', count: '290+ places', image: '/cities/noida.webp' },
    { name: 'Bangalore', count: '650+ places', image: '/cities/bangalore.webp' },
    { name: 'Pune', count: '320+ places', image: '/cities/pune.webp' },
  ];

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch('/api/listings?status=ACTIVE');
        if (res.ok) {
          const data = await res.json();
          setLatestListings(data.listings.slice(0, 6));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCity) params.set('city', selectedCity);
    router.push(`/explore?${params.toString()}`);
  };

  const homepageFaqs = [
    {
      question: "Is Shahya really 100% free with zero brokerage?",
      answer: "Yes, Shahya is completely free. We do not charge broker commissions, and we never lock owner or flatmate contacts behind paid paywalls."
    },
    {
      question: "How do I find flatmates in Manesar, Gurgaon, or Delhi?",
      answer: "You can use Shahya's city hubs or search bar to browse verified rooms and flatmate seeker profiles in IMT Manesar, Cyber City, DLF Phase 1-5, Sector 56, Saket, and Delhi NCR. Filter by lifestyle preferences and chat directly for free."
    },
    {
      question: "Can I post a room or flatmate seeker request on Shahya?",
      answer: "Yes, anyone with a vacant room or anyone looking for a flatmate can post a listing in under 2 minutes with interactive 16:9 photo cropping and instant live publishing."
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-16 min-h-[calc(100dvh-4rem)] flex flex-col justify-between">
      <JsonLd data={getFaqSchema(homepageFaqs)} />
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-[#f8fafc] pt-6 pb-10 sm:pt-16 sm:pb-20 border-b border-slate-100">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-brand-200/40 via-indigo-100/30 to-purple-100/20 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-8">
          
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-200 shadow-xs text-[11px] sm:text-xs font-bold text-brand-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 flex-shrink-0" />
            <span className="truncate">100% Free Direct Chat • Zero Brokerage</span>
          </div>

          {/* Hero Heading */}
          <div className="max-w-3xl mx-auto space-y-2 sm:space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Find a place.{' '}
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                Find your people.
              </span>
            </h1>
            <p className="text-xs sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto px-2">
              Rooms, flats and flatmates across India. Connect directly with verified members and chat for free.
            </p>
          </div>

          {/* Search Box (100% Responsive & Compact, No Overflow) */}
          <div className="max-w-2xl mx-auto w-full px-1">
            <form
              onSubmit={handleSearch}
              className="p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-white shadow-floating border border-slate-200/90 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              {/* Locality Input */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50/70 sm:bg-transparent border border-slate-200/60 sm:border-none flex-1 min-w-0">
                <Search className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Locality (e.g. Sector 43, Indiranagar)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none truncate"
                />
              </div>

              {/* City Select + Submit Button Row */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 flex-1 sm:flex-none whitespace-nowrap"
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
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 sm:flex-none flex-shrink-0 active:scale-95"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </form>

            {/* Popular City Chips */}
            <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap text-[11px] text-slate-500">
              <span className="font-bold text-slate-600 mr-0.5">Popular:</span>
              {['Gurgaon', 'Delhi', 'Noida', 'Bangalore', 'Pune', 'Cyber City'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    if (['Gurgaon', 'Delhi', 'Noida', 'Bangalore', 'Pune'].includes(city)) {
                      setSelectedCity(city);
                    } else {
                      setSearchQuery(city);
                    }
                  }}
                  className="px-2 py-0.5 rounded-full bg-white hover:bg-brand-50 hover:text-brand-600 border border-slate-200/80 transition-colors shadow-2xs whitespace-nowrap"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* DUAL INTENT CARDS */}
          <div className="max-w-4xl mx-auto pt-2 sm:pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 text-left">
            
            {/* Card 1: Find a Place */}
            <Link
              href="/explore?type=HAVE_PLACE"
              className="group p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card hover:shadow-floating transition-all duration-300 flex flex-col justify-between hover:border-brand-300"
            >
              <div className="space-y-2 sm:space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                  <Home className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors flex items-center justify-between">
                    <span>🏠 Find a Place</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Browse private rooms, shared flats, and verified places with zero brokerage.
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1 text-[11px] sm:text-xs font-bold text-brand-600">
                <span>Explore Available Rooms</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Card 2: Find a Flatmate */}
            <Link
              href="/explore?type=NEED_PLACE"
              className="group p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card hover:shadow-floating transition-all duration-300 flex flex-col justify-between hover:border-purple-300"
            >
              <div className="space-y-2 sm:space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors flex items-center justify-between">
                    <span>👥 Find a Flatmate</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Connect with working professionals & students seeking flatmates based on lifestyle.
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1 text-[11px] sm:text-xs font-bold text-purple-600">
                <span>Browse Flatmate Seekers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

          </div>

        </div>
      </section>


      {/* 2. BROWSE BY CITY */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by City
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Find shared accommodations in top metropolitan tech hubs
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 whitespace-nowrap"
          >
            <span>All Cities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {cities.map((city) => (
            <Link
              key={city.name}
              href={`/explore?city=${city.name}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-card hover:shadow-floating transition-all duration-300"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-3 sm:p-4 flex flex-col justify-end text-white">
                <span className="text-sm sm:text-lg font-black tracking-tight">{city.name}</span>
                <span className="text-[10px] sm:text-xs text-slate-300">{city.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* 3. LATEST LISTINGS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                Featured
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Latest Listings
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Freshly posted verified rooms and shared apartments with zero brokerage
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 whitespace-nowrap"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <ListingGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {latestListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* 4. HOW SHAHYA WORKS (5-STEP FLOW) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-6">
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-2xl space-y-6">
          
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Simple & Transparent</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              How Shahya Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              No brokers, no contact unlock paywalls. Just simple, direct connection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
              <div className="w-7 h-7 rounded-xl bg-brand-500 text-white font-black flex items-center justify-center text-xs">
                1
              </div>
              <h3 className="font-bold text-sm text-white">Create Profile</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add occupation, diet, smoking, pets, and sleep habits.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
              <div className="w-7 h-7 rounded-xl bg-brand-500 text-white font-black flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-white">Post or Discover</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Post room vacancy or browse listings in your budget.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
              <div className="w-7 h-7 rounded-xl bg-brand-500 text-white font-black flex items-center justify-center text-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-white">Match Score</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                See compatibility match scores (e.g. 92% Match) instantly.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-brand-600 text-white border border-brand-400 space-y-1.5 shadow-md">
              <div className="w-7 h-7 rounded-xl bg-white text-brand-700 font-black flex items-center justify-center text-xs">
                4
              </div>
              <h3 className="font-bold text-sm text-white">Chat Directly</h3>
              <p className="text-xs text-brand-100 leading-relaxed">
                Real-time messaging with attached room context. 100% free.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
              <div className="w-7 h-7 rounded-xl bg-brand-500 text-white font-black flex items-center justify-center text-xs">
                5
              </div>
              <h3 className="font-bold text-sm text-white">Visit & Move In</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Meet up, verify the room, and move into your new home!
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center gap-2 text-brand-600">
            <HelpCircle className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Common Questions</span>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Everything you need to know about finding flatmates and zero-brokerage shared rooms on Shahya.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {homepageFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 bg-slate-50/60 hover:bg-slate-100/80 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      activeFaq === idx ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
