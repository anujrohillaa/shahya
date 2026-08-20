'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import {
  LayoutDashboard,
  Home,
  Heart,
  Eye,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Edit,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  User,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import { ListingItem } from '@/lib/types';

function DashboardContent() {
  const { user } = useAuth();
  const { confirm, success, error } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = searchParams.get('tab') || 'listings';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [listingStatusFilter, setListingStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DRAFT' | 'CLOSED' | 'EXPIRED'>('ALL');

  const [myListings, setMyListings] = useState<ListingItem[]>([]);
  const [savedListings, setSavedListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch my listings
      const listRes = await fetch(`/api/listings?userId=${user.id}&status=ALL`);
      if (listRes.ok) {
        const data = await listRes.json();
        setMyListings(data.listings || []);
      }

      // Fetch saved listings
      const savedRes = await fetch('/api/saved');
      if (savedRes.ok) {
        const data = await savedRes.json();
        setSavedListings(data.listings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleUpdateStatus = async (listingId: string, status: string, action?: string) => {
    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, action }),
      });
      if (res.ok) {
        success(action === 'renew' ? 'Listing activated & renewed for 30 days!' : `Listing marked as ${status.toLowerCase()}`);
        fetchDashboardData();
      }
    } catch (e) {
      error('Failed to update listing status');
    }
  };

  const handleDeleteListing = (listingId: string) => {
    confirm({
      title: 'Delete Listing',
      message: 'Are you sure you want to permanently delete this listing? All active conversations attached to this listing will be preserved.',
      confirmText: 'Delete Permanently',
      cancelText: 'Keep Listing',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/listings/${listingId}`, { method: 'DELETE' });
          if (res.ok) {
            success('Listing deleted successfully');
            fetchDashboardData();
          } else {
            error('Could not delete listing');
          }
        } catch (e) {
          error('Error deleting listing');
        }
      },
    });
  };

  const totalViews = myListings.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
  const activeListingsCount = myListings.filter(l => l.status === 'ACTIVE').length;

  const filteredMyListings = myListings.filter(l => {
    if (listingStatusFilter === 'ALL') return true;
    return l.status === listingStatusFilter;
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4 min-h-[70vh] flex flex-col items-center justify-center w-full overflow-hidden">
        <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <User className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to view Account</h2>
        <p className="text-xs text-slate-500">Manage your active listings, saved places, and conversations.</p>
        <Link href="/login" className="inline-block px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md">
          Log In / Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8 pb-24 min-h-[calc(100dvh-4rem)] w-full max-w-full overflow-x-hidden">
      
      {/* 1. USER ACCOUNT BANNER CARD */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-4 w-full max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
          
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-brand-500/20 shadow-sm flex-shrink-0"
            />
            <div className="min-w-0 flex-1 overflow-hidden space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-base sm:text-2xl font-extrabold text-slate-900 truncate">
                  {user.name}
                </h1>
                {user.isPhoneVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">{user.email || user.phone}</p>
              <p className="text-[10px] sm:text-[11px] text-brand-600 font-semibold truncate">
                {user.occupation === 'WORKING_PROFESSIONAL' ? 'Working Professional' : user.occupation === 'STUDENT' ? 'Student' : 'Resident'}
                {user.companyCollege && ` • ${user.companyCollege}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
            <Link
              href="/profile/edit"
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Link>
            <Link
              href="/post"
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Listing</span>
            </Link>
          </div>

        </div>
      </div>


      {/* 2. KPI STATS (Clean 2x2 on Mobile, 4x1 on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full">
        
        <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">Active</span>
            <Home className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 truncate">{activeListingsCount}</p>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">Views</span>
            <Eye className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 truncate">{totalViews}</p>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">Saved</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 truncate">{savedListings.length}</p>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">Status</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          </div>
          <p className="text-[11px] sm:text-sm font-bold text-emerald-700 flex items-center gap-1 mt-1 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Verified</span>
          </p>
        </div>

      </div>


      {/* 3. NAVIGATION TABS */}
      <div className="border-b border-slate-200 w-full overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm font-bold min-w-max">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-2.5 sm:pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'listings'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>My Listings ({myListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-2.5 sm:pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'saved'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved ({savedListings.length})</span>
          </button>
        </div>
      </div>


      {/* TAB 1: MY LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4 w-full">
          
          {/* Sub-filter tabs (Active, Draft, Closed, Expired) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-bold w-full">
            {(['ALL', 'ACTIVE', 'DRAFT', 'CLOSED', 'EXPIRED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setListingStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap flex-shrink-0 ${
                  listingStatusFilter === st
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st === 'ALL' ? 'All Listings' : st}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3 w-full">
              {[1, 2].map(i => (
                <div key={i} className="h-24 bg-white border border-slate-200 animate-pulse rounded-2xl w-full" />
              ))}
            </div>
          ) : filteredMyListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-card space-y-3 w-full">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">No listings in this tab</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Post your room vacancy or flatmate seeker profile to receive direct responses.
              </p>
              <Link
                href="/post"
                className="inline-block px-5 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-xs"
              >
                Create a Free Listing
              </Link>
            </div>
          ) : (
            <div className="space-y-3 w-full">
              {filteredMyListings.map((listing) => {
                const cover = listing.photos?.[0]?.url || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80';

                return (
                  <div
                    key={listing.id}
                    className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 hover:border-slate-300 transition-all w-full max-w-full overflow-hidden"
                  >
                    <div className="flex items-center gap-3 min-w-0 w-full">
                      <img
                        src={cover}
                        alt={listing.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="space-y-1 min-w-0 flex-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide flex-shrink-0 ${
                            listing.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : listing.status === 'DRAFT'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {listing.status}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium truncate">
                            👁 {listing.viewsCount || 0} Views
                          </span>
                        </div>

                        <Link href={`/listing/${listing.id}`} className="block">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors truncate">
                            {listing.title}
                          </h4>
                        </Link>

                        <p className="text-[11px] text-slate-500 truncate">
                          ₹{listing.rent?.toLocaleString('en-IN')}/mo • {listing.locality}, {listing.city}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons (Clean single row) */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 w-full">
                      <Link
                        href={`/listing/${listing.id}`}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1 flex-shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        <span>View</span>
                      </Link>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {listing.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleUpdateStatus(listing.id, 'CLOSED')}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 whitespace-nowrap"
                          >
                            Mark Closed
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(listing.id, 'ACTIVE', 'renew')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 whitespace-nowrap"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Renew</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0"
                          title="Delete listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}


      {/* TAB 2: SAVED LISTINGS */}
      {activeTab === 'saved' && (
        <div className="w-full">
          {savedListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-card space-y-3 w-full">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">No saved listings yet</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click the heart icon on any listing card to bookmark rooms or potential flatmates.
              </p>
              <Link
                href="/explore"
                className="inline-block px-5 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-xs"
              >
                Browse Listings
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
              {savedListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onSaveToggle={(id, saved) => {
                    if (!saved) {
                      setSavedListings(prev => prev.filter(l => l.id !== id));
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-slate-400">Loading account...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
