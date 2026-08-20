'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Home, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import { ListingItem } from '@/lib/types';
import JsonLd, { getFaqSchema, getBreadcrumbSchema } from '@/components/JsonLd';

const cityNeighborhoods: Record<string, string[]> = {
  manesar: ['IMT Manesar', 'Sector 1', 'Sector 2', 'Sector 8', 'Sector 9', 'Cyberwalk IT Park', 'Maruti Area', 'NSG Campus'],
  gurgaon: ['Cyber City', 'Sector 56', 'Sector 43', 'DLF Phase 1', 'DLF Phase 2', 'DLF Phase 3', 'Golf Course Road', 'Sohna Road', 'Sector 24'],
  delhi: ['Saket', 'Hauz Khas', 'North Campus (DU)', 'Dwarka', 'Greater Kailash', 'South Extension', 'Laxmi Nagar', 'Rohini'],
  noida: ['Sector 62', 'Sector 18', 'Sector 137', 'Noida Expressway', 'Sector 75', 'Sector 76', 'Knowledge Park'],
  faridabad: ['Sector 15', 'Sector 16', 'Sector 21C', 'Greenfield Colony', 'NIT Faridabad', 'Sector 37'],
  ghaziabad: ['Indirapuram', 'Vaishali', 'Vasundhara', 'Crossings Republik', 'Raj Nagar Extension'],
  bangalore: ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Bellandur', 'Electronic City', 'BTM Layout'],
  pune: ['Hinjewadi', 'Viman Nagar', 'Kharadi', 'Baner', 'Wakad', 'Kothrud'],
  mumbai: ['Andheri West', 'Bandra West', 'Powai', 'Goregaon East', 'Malad', 'Thane West', 'Navi Mumbai'],
  hyderabad: ['Hitech City', 'Gachibowli', 'Madhapur', 'Kondapur', 'Kukatpally', 'Banjara Hills'],
};

export default function CityRoomsPage() {
  const params = useParams<{ city: string }>();
  const rawCity = (params.city || 'gurgaon').toLowerCase();
  const cityName = rawCity.charAt(0).toUpperCase() + rawCity.slice(1);
  const neighborhoods = cityNeighborhoods[rawCity] || ['Central Sector', 'Metro Station Area', 'Main Road', 'IT Hub'];

  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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

  const faqs = [
    {
      question: `How can I find a room for rent in ${cityName} without paying brokerage?`,
      answer: `On Shahya, all room listings in ${cityName} are posted directly by verified flatmates and flat owners. You can browse listings, view high-res photos, and message the poster directly through built-in chat without paying any contact unlock fees or broker commission.`
    },
    {
      question: `What are the most popular areas to find shared flats in ${cityName}?`,
      answer: `Top areas in ${cityName} for working professionals and students include ${neighborhoods.slice(0, 5).join(', ')}. These localities offer easy connectivity to metro stations, office parks, and markets.`
    },
    {
      question: `How much does a private room or shared accommodation cost in ${cityName}?`,
      answer: `In ${cityName}, shared rooms typically range from ₹4,500 to ₹9,000 per month, while private rooms in premium gated societies range between ₹10,000 to ₹22,000 per month depending on the exact locality and amenities.`
    },
    {
      question: `Is Shahya free for room hosts and flatmates in ${cityName}?`,
      answer: `Yes, posting a room and communicating with prospective flatmates in ${cityName} is 100% free on Shahya with zero hidden charges.`
    }
  ];

  const breadcrumbs = [
    { name: 'Home', url: 'https://shahya.com' },
    { name: 'Rooms', url: 'https://shahya.com/explore' },
    { name: `${cityName} Rooms`, url: `https://shahya.com/rooms/${rawCity}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 pb-24">
      {/* Schema.org Structured Data */}
      <JsonLd data={getFaqSchema(faqs)} />
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />

      {/* Hero Header */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-brand-950 via-slate-900 to-indigo-950 text-white space-y-4 shadow-xl border border-brand-900/50">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20 text-brand-300">
          <MapPin className="w-3.5 h-3.5" />
          <span>{cityName} Accommodation Hub</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Rooms for Rent in {cityName} — Zero Brokerage
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Discover verified private rooms, master bedrooms, and shared flats in {cityName}. Chat directly with roommates and owners without paying brokerage fees.
        </p>

        {/* Local Area Quick Filters */}
        <div className="pt-3 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Popular {cityName} Neighborhoods:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {neighborhoods.map((n) => (
              <Link
                key={n}
                href={`/explore?city=${cityName}&locality=${encodeURIComponent(n)}`}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-brand-600/80 text-white text-xs font-semibold backdrop-blur-xs transition-colors border border-white/10"
              >
                {n}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Available Rooms in {cityName} ({listings.length})
            </h2>
            <p className="text-xs text-slate-500">Verified listings with direct contact</p>
          </div>

          <Link
            href={`/explore?city=${cityName}`}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200"
          >
            <span>View All with Filters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-sm text-slate-500 space-y-3">
            <p className="text-base font-bold text-slate-800">No rooms currently posted in {cityName}.</p>
            <p className="text-xs text-slate-500">Be the first to post your room and connect with flatmate seekers!</p>
            <Link href="/post" className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md">
              Post Your Room for Free
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>

      {/* SEO & FAQ Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Frequently Asked Questions about Finding Rooms in {cityName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Everything you need to know about renting shared flats in {cityName} on Shahya.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
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

    </div>
  );
}
