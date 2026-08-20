'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Heart,
  Share2,
  ShieldCheck,
  Calendar,
  Sparkles,
  Home,
  CheckCircle2,
  Flag,
  MessageSquare,
  Images,
  Wifi,
  Wind,
  Tv,
  Car,
  Dumbbell,
  Shield,
  Zap,
  Coffee,
  Check,
  ArrowLeft
} from 'lucide-react';
import { ListingItem } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import { ListingDetailSkeleton } from '@/components/ui/CustomLoader';
import PhotoGalleryModal from '@/components/PhotoGalleryModal';
import ReportModal from '@/components/ReportModal';
import ShareModal from '@/components/ShareModal';
import SafetyBanner from '@/components/SafetyBanner';
import { calculateMatchScore } from '@/lib/matching';

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { success, error, warning } = useToast();
  const router = useRouter();

  const [listing, setListing] = useState<ListingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (res.ok) {
          const data = await res.json();
          setListing(data.listing);
          setIsSaved(data.listing.isSaved || false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchListing();
  }, [id]);

  const handleToggleSave = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    const next = !isSaved;
    setIsSaved(next);

    try {
      await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: id }),
      });
      success(next ? 'Saved to bookmarks' : 'Removed from bookmarks');
    } catch (e) {
      setIsSaved(!next);
    }
  };

  const handleStartChat = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (listing?.userId === user.id) {
      warning('You cannot message yourself on your own listing.', 'Your Own Listing');
      return;
    }

    setStartingChat(true);
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: id,
          initialMessage: `Hi ${listing?.user?.name.split(' ')[0] || 'there'}, is this room still available?`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/messages/${data.conversationId}`);
      } else {
        const err = await res.json();
        error(err.error || 'Failed to start chat');
      }
    } catch (e) {
      error('Error initiating conversation');
    } finally {
      setStartingChat(false);
    }
  };

  const handleShare = () => {
    setShareOpen(true);
  };

  if (loading) {
    return <ListingDetailSkeleton />;
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Listing Not Found</h2>
        <p className="text-xs text-slate-500">This property might have been closed or expired.</p>
        <Link href="/explore" className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs">
          Browse Active Listings
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === listing.userId;
  const isHavePlace = listing.type === 'HAVE_PLACE';
  const photos = listing.photos && listing.photos.length > 0 ? listing.photos : [
    { id: '1', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80', isCover: true, order: 0 }
  ];
  const cover = photos[0]?.url || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80';
  const matchScore = (listing as any).matchScore || calculateMatchScore(user, listing);

  const amenityIconMap: Record<string, any> = {
    WIFI: Wifi,
    AC: Wind,
    WASHING_MACHINE: Sparkles,
    REFRIGERATOR: Sparkles,
    ATTACHED_BATHROOM: Sparkles,
    BALCONY: Home,
    FURNISHED: Home,
    MAID_SERVICE: Sparkles,
    COOK_AVAILABLE: Sparkles,
    TV: Tv,
    PARKING: Car,
    GYM: Dumbbell,
    SECURITY: Shield,
    GATED_SOCIETY: Shield,
    POWER_BACKUP: Zap,
    KITCHEN: Coffee,
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 pb-28 sm:pb-16 min-h-[calc(100dvh-4rem)]">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors whitespace-nowrap active:scale-95 shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5 text-brand-600" />
            <span>Share</span>
          </button>

          <button
            onClick={handleToggleSave}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors whitespace-nowrap ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>


      {/* 1. PHOTO GALLERY GRID (Dynamic adaptive grid for 1, 2, or 3+ unique photos) */}
      <div className="relative rounded-3xl overflow-hidden shadow-card border border-slate-200/80 bg-slate-900">
        {photos.length === 1 ? (
          /* Single Photo: Full-width banner */
          <div
            onClick={() => setGalleryOpen(true)}
            className="relative cursor-pointer group overflow-hidden aspect-[16/10] md:aspect-[21/9] w-full"
          >
            <img
              src={photos[0].url}
              alt="Main listing photo"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : photos.length === 2 ? (
          /* Two Photos: Clean 2-column split */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 aspect-[16/10] md:aspect-[21/9]">
            <div
              onClick={() => setGalleryOpen(true)}
              className="relative cursor-pointer group overflow-hidden h-full"
            >
              <img
                src={photos[0].url}
                alt="Main photo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div
              onClick={() => setGalleryOpen(true)}
              className="hidden md:block relative cursor-pointer group overflow-hidden h-full"
            >
              <img
                src={photos[1].url}
                alt="Interior photo 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        ) : (
          /* Three or More Photos: Primary + 2 Secondary with count overlay */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 aspect-[16/10] md:aspect-[21/9]">
            <div
              onClick={() => setGalleryOpen(true)}
              className="md:col-span-2 relative cursor-pointer group overflow-hidden h-full"
            >
              <img
                src={photos[0].url}
                alt="Main listing photo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div
              onClick={() => setGalleryOpen(true)}
              className="hidden md:block relative cursor-pointer group overflow-hidden h-full"
            >
              <img
                src={photos[1].url}
                alt="Interior photo 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div
              onClick={() => setGalleryOpen(true)}
              className="hidden md:block relative cursor-pointer group overflow-hidden h-full"
            >
              <img
                src={photos[2].url}
                alt="Interior photo 3"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {photos.length > 3 && (
                <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center text-white font-extrabold text-base">
                  +{photos.length - 3} Photos
                </div>
              )}
            </div>
          </div>
        )}

        {/* View All Photos Button */}
        <button
          onClick={() => setGalleryOpen(true)}
          className="absolute bottom-3 right-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-md backdrop-blur-md flex items-center gap-1.5 transition-transform active:scale-95 whitespace-nowrap"
        >
          <Images className="w-3.5 h-3.5 text-brand-600" />
          <span>{photos.length} Photo{photos.length > 1 ? 's' : ''}</span>
        </button>
      </div>


      {/* 2. MAIN DETAILS & STICKY CONTACT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Listing Details */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          
          {/* Header Title & Specs */}
          <div className="space-y-2.5 pb-5 border-b border-slate-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-brand-50 text-brand-700 border border-brand-200 whitespace-nowrap">
                {listing.type === 'HAVE_PLACE' ? '🏠 Place Available' : '🔍 Seeking Room'}
              </span>
              <div className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 whitespace-nowrap">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                <span>{matchScore}% Match</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {listing.title}
            </h1>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{listing.locality}, {listing.city} {listing.landmark && `(Near ${listing.landmark})`}</span>
            </div>
          </div>


          {/* Property Specs Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-card space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Room Type</span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {listing.roomType === 'PRIVATE_ROOM' ? 'Private Room' : listing.roomType === 'SHARED_ROOM' ? 'Shared Room' : 'Entire Flat'}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-card space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Property</span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {listing.bedrooms ? `${listing.bedrooms} BHK ` : ''}{listing.propertyType || 'Apartment'}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-card space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Move-in</span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {listing.moveInImmediate ? 'Immediate' : listing.availableFrom ? new Date(listing.availableFrom).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Flexible'}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 shadow-card space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Looking For</span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {listing.preferredGender === 'MALE' ? 'Male Only' : listing.preferredGender === 'FEMALE' ? 'Female Only' : 'Any Gender'}
              </p>
            </div>
          </div>


          {/* Description */}
          <div className="space-y-2 pb-5 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-900">About this place</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {listing.description || 'No description provided.'}
            </p>
          </div>


          {/* Amenities Grid */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="space-y-3 pb-5 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {listing.amenities.map((amenity) => {
                  const Icon = amenityIconMap[amenity] || Check;
                  const label = amenity.replace(/_/g, ' ').toLowerCase();
                  return (
                    <div
                      key={amenity}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs font-semibold text-slate-800 capitalize whitespace-nowrap truncate"
                    >
                      <Icon className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                      <span className="truncate">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* House Rules */}
          {listing.preferences && listing.preferences.length > 0 && (
            <div className="space-y-3 pb-5 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">House Preferences</h3>
              <div className="flex flex-wrap gap-1.5">
                {listing.preferences.map((pref) => (
                  <span
                    key={pref}
                    className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 whitespace-nowrap"
                  >
                    ✓ {pref.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}


          {/* Poster Profile Preview */}
          {listing.user && (
            <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Posted by</span>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={listing.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${listing.user.name}`}
                    alt={listing.user.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/20 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {listing.user.name}{listing.user.age ? `, ${listing.user.age}` : ''}
                      </h4>
                      {listing.user.isPhoneVerified && (
                        <span title="Phone Verified" className="flex-shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium truncate">
                      {listing.user.occupation === 'WORKING_PROFESSIONAL' ? 'Working Professional' : listing.user.occupation === 'STUDENT' ? 'Student' : 'Resident'}
                      {listing.user.companyCollege && ` at ${listing.user.companyCollege}`}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/profile/${listing.user.id}`}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 whitespace-nowrap flex-shrink-0 hidden sm:block"
                >
                  Profile
                </Link>
              </div>

              {listing.user.bio && (
                <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{listing.user.bio}"
                </p>
              )}
            </div>
          )}


          {/* Safety Advisory Banner */}
          <SafetyBanner />

          {/* Report Button */}
          <div className="pt-1">
            <button
              onClick={() => setReportOpen(true)}
              className="text-xs font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report this listing</span>
            </button>
          </div>

        </div>


        {/* Right 1 Col: STICKY PRICING & CHAT CARD (Desktop) */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-floating space-y-5">
            
            {/* Rent Header */}
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <div className="flex items-baseline gap-1 whitespace-nowrap">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {listing.type === 'HAVE_PLACE'
                    ? formatCurrency(listing.rent)
                    : `₹${(listing.minBudget || 10000).toLocaleString('en-IN')} - ₹${(listing.maxBudget || 15000).toLocaleString('en-IN')}`}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Zero Brokerage • 100% Free</span>
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Security Deposit</span>
                <span className="font-bold text-slate-900">
                  {listing.securityDeposit ? formatCurrency(listing.securityDeposit) : '1 Month Rent'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Utilities</span>
                <span className="font-bold text-slate-900">
                  {listing.utilityEstimate ? `~ ${formatCurrency(listing.utilityEstimate)}/mo` : 'Shared'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Brokerage</span>
                <span className="font-bold text-emerald-600">₹0 (Free)</span>
              </div>
            </div>

            {/* Direct Chat CTA */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={handleStartChat}
                disabled={startingChat}
                className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{startingChat ? 'Opening Messenger...' : `Chat with ${listing.user?.name.split(' ')[0] || 'Host'}`}</span>
              </button>

              <button
                onClick={handleToggleSave}
                className={`w-full py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save for Later'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>


      {/* MOBILE STICKY BOTTOM ACTION BAR (Clean single-row design) */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3.5 py-2.5 shadow-2xl flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-base font-black text-slate-900">
              {formatCurrency(listing.rent)}
            </span>
            <span className="text-[10px] text-slate-400">/mo</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block leading-none">Zero Brokerage</span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 active:scale-95 transition-all flex items-center gap-1 text-xs font-semibold"
            title="Share listing"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden xs:inline">Share</span>
          </button>

          <button
            onClick={handleToggleSave}
            className={`p-2 rounded-xl border transition-all active:scale-95 ${
              isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
            title={isSaved ? "Saved" : "Save listing"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleStartChat}
            disabled={startingChat}
            className="py-2 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
        </div>
      </div>


      {/* Fullscreen Photo Lightbox Modal */}
      {galleryOpen && (
        <PhotoGalleryModal
          photos={photos}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      {/* Report Modal */}
      {reportOpen && (
        <ReportModal
          listingId={listing.id}
          title={listing.title}
          onClose={() => setReportOpen(false)}
        />
      )}

      {/* Instant Share Sheet Modal */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={listing.title}
        rent={listing.rent}
        locality={listing.locality}
        city={listing.city}
        coverImage={photos[0]?.url}
      />

    </div>
  );
}
