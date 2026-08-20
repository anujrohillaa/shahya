'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Users, MapPin, ArrowRight, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';
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

export default function CityFlatmatesPage() {
  const params = useParams<{ city: string }>();
  const rawCity = (params.city || 'gurgaon').toLowerCase();
  const cityName = rawCity.charAt(0).toUpperCase() + rawCity.slice(1);
  const neighborhoods = cityNeighborhoods[rawCity] || ['Central Sector', 'Metro Station Area', 'Main Road', 'IT Hub'];

  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCityFlatmates() {
      try {
        const res = await fetch(`/api/listings?city=${cityName}&type=NEED_PLACE&status=ACTIVE`);
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
    fetchCityFlatmates();
  }, [cityName]);

  const faqs = [
    {
      question: `How can I find a compatible flatmate in ${cityName}?`,
      answer: `On Shahya, you can filter flatmate seekers in ${cityName} by gender preferences, food/diet (Veg/Non-Veg), smoking habits, sleep routines, and occupation. Chat directly for free to see if your lifestyle matches.`
    },
    {
      question: `Can I team up with another flatmate to rent a whole flat in ${cityName}?`,
      answer: `Yes! Many room seekers on Shahya connect to form flatmate groups and jointly rent 2BHK or 3BHK apartments in ${cityName}, significantly saving on rent and deposit costs.`
    },
    {
      question: `Is Shahya free to message flatmates in ${cityName}?`,
      answer: `Yes, direct messaging with flatmate seekers in ${cityName} is completely free on Shahya with zero contact fees or premium paywalls.`
    }
  ];

  const breadcrumbs = [
    { name: 'Home', url: 'https://shahya.com' },
    { name: 'Flatmates', url: 'https://shahya.com/explore?type=NEED_PLACE' },
    { name: `${cityName} Flatmates`, url: `https://shahya.com/flatmates/${rawCity}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 pb-24">
      {/* Schema.org Structured Data */}
      <JsonLd data={getFaqSchema(faqs)} />
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />

      {/* Hero Header */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white space-y-4 shadow-xl border border-purple-900/50">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20 text-purple-300">
          <Users className="w-3.5 h-3.5" />
          <span>{cityName} Room Seekers & Flatmates</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Find Compatible Flatmates in {cityName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Connect with verified professionals and students looking for shared accommodation in {cityName}. Match based on diet, sleep schedule, and work routine.
        </p>

        {/* Local Area Quick Filters */}
        <div className="pt-3 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Top {cityName} Localities:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {neighborhoods.map((n) => (
              <Link
                key={n}
                href={`/explore?city=${cityName}&type=NEED_PLACE&locality=${encodeURIComponent(n)}`}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-purple-600/80 text-white text-xs font-semibold backdrop-blur-xs transition-colors border border-white/10"
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
              Flatmate Seekers in {cityName} ({listings.length})
            </h2>
            <p className="text-xs text-slate-500">Verified seekers ready to share a flat</p>
          </div>

          <Link
            href={`/explore?city=${cityName}&type=NEED_PLACE`}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200"
          >
            <span>View All Seekers</span>
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
            <p className="text-base font-bold text-slate-800">No flatmate seekers currently posted in {cityName}.</p>
            <p className="text-xs text-slate-500">Post your seeker profile today to find flatmates fast!</p>
            <Link href="/post" className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md">
              Post Seeker Profile
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
            Frequently Asked Questions about Flatmates in {cityName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Learn how flatmate matching and team-ups work on Shahya.
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
                    activeFaq === idx ? 'rotate-180 text-purple-600' : ''
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
