'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import {
  User,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Sparkles,
  Home,
  MessageSquare,
  Edit,
  Heart,
  Ban,
  CheckCircle2,
  Cigarette,
  Utensils,
  Moon,
  Dog,
  Sparkle,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { FullPageLoader } from '@/components/ui/CustomLoader';
import ListingCard from '@/components/ListingCard';
import { ListingItem, UserProfile } from '@/lib/types';

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [userListings, setUserListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Always fetch user by ID first — independent of listings
        const userRes = await fetch(`/api/users/${id}`);
        if (!userRes.ok) {
          setNotFound(true);
          return;
        }
        const userData = await userRes.json();
        setProfileUser(userData.user);

        // Fetch their active listings separately
        const listRes = await fetch(`/api/listings?userId=${id}&status=ACTIVE`);
        if (listRes.ok) {
          const listData = await listRes.json();
          setUserListings(listData.listings || []);
        }
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProfile();
  }, [id]);

  const handleStartChat = async () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (!profileUser) return;
    setChatLoading(true);
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: profileUser.id }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/messages/${data.conversationId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return <FullPageLoader message="Loading member profile..." />;
  }

  if (notFound || !profileUser) {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Profile Not Found</h2>
        <p className="text-xs text-slate-500">This user profile doesn't exist or has been removed.</p>
        <Link href="/explore" className="text-xs font-bold text-brand-600">Browse Listings</Link>
      </div>
    );
  }

  const isMe = currentUser?.id === profileUser.id;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8 pb-24 min-h-[calc(100dvh-4rem)]">

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* 1. PROFILE BANNER CARD */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-card space-y-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <img
              src={profileUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser.name}`}
              alt={profileUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-brand-500/20 shadow-md flex-shrink-0"
            />
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {profileUser.name}{profileUser.age ? `, ${profileUser.age}` : ''}
                </h1>
                {profileUser.isPhoneVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Phone Verified
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {profileUser.occupation === 'WORKING_PROFESSIONAL' ? 'Working Professional' : profileUser.occupation === 'STUDENT' ? 'Student' : 'Independent'}
                  {(profileUser as any).companyCollege && ` • ${(profileUser as any).companyCollege}`}
                </span>
              </p>

              <p className="text-[11px] text-slate-400">
                Member since {new Date((profileUser as any).createdAt || Date.now()).getFullYear()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {isMe ? (
              <Link
                href="/profile/edit"
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>
            ) : (
              <button
                onClick={handleStartChat}
                disabled={chatLoading}
                className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-60"
              >
                {chatLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MessageSquare className="w-4 h-4" />
                )}
                <span>{chatLoading ? 'Opening chat...' : 'Chat with ' + profileUser.name.split(' ')[0]}</span>
              </button>
            )}
          </div>

        </div>

        {/* About Bio */}
        {profileUser.bio && (
          <div className="pt-4 border-t border-slate-100 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">About Me</span>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {profileUser.bio}
            </p>
          </div>
        )}

      </div>


      {/* 2. LIFESTYLE COMPATIBILITY PREFERENCES */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>Lifestyle & Living Habits</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Smoking</span>
            <p className="text-xs font-bold text-slate-800">
              {(profileUser as any).smoking === 'NO'
                ? '🚭 Non-Smoker'
                : (profileUser as any).smoking === 'YES'
                ? '🚬 Smoker'
                : (profileUser as any).smoking === 'OCCASIONALLY'
                ? '💨 Occasionally'
                : <span className="text-slate-400 font-medium">Not set</span>}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Food / Diet</span>
            <p className="text-xs font-bold text-slate-800">
              {(profileUser as any).foodPreference === 'VEG'
                ? '🥗 Vegetarian'
                : (profileUser as any).foodPreference === 'NON_VEG'
                ? '🍗 Non-Vegetarian'
                : (profileUser as any).foodPreference === 'BOTH'
                ? '🍲 Both / Flexible'
                : <span className="text-slate-400 font-medium">Not set</span>}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sleep Schedule</span>
            <p className="text-xs font-bold text-slate-800">
              {profileUser.sleepSchedule === 'EARLY'
                ? '☀️ Early Riser'
                : profileUser.sleepSchedule === 'LATE'
                ? '🌙 Night Owl'
                : profileUser.sleepSchedule === 'FLEXIBLE'
                ? '⏰ Flexible'
                : <span className="text-slate-400 font-medium">Not set</span>}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pets</span>
            <p className="text-xs font-bold text-slate-800">
              {(profileUser as any).pets === 'HAVE_PETS'
                ? '🐶 Has Pets'
                : (profileUser as any).pets === 'OKAY_WITH_PETS'
                ? '🐾 Okay with Pets'
                : (profileUser as any).pets === 'NOT_OKAY'
                ? '❌ No Pets'
                : <span className="text-slate-400 font-medium">Not set</span>}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Flatmate Preference</span>
            <p className="text-xs font-bold text-slate-800">
              {(profileUser as any).genderPreference === 'MALE'
                ? '👨 Male Only'
                : (profileUser as any).genderPreference === 'FEMALE'
                ? '👩 Female Only'
                : (profileUser as any).genderPreference === 'ANY'
                ? '👥 Any Gender'
                : <span className="text-slate-400 font-medium">Not set</span>}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Listings</span>
            <p className="text-xs font-bold text-slate-800">
              {(profileUser as any)._count?.listings ?? userListings.length} listing{((profileUser as any)._count?.listings ?? userListings.length) !== 1 ? 's' : ''}
            </p>
          </div>

        </div>
      </div>


      {/* 3. ACTIVE LISTINGS BY USER */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Listings by {profileUser.name.split(' ')[0]} ({userListings.length})
        </h3>

        {userListings.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-3">
            <p className="text-xs text-slate-400">No active listings from this user right now.</p>
            {!isMe && (
              <button
                onClick={handleStartChat}
                disabled={chatLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all active:scale-95 disabled:opacity-60"
              >
                {chatLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
                <span>Chat directly with {profileUser.name.split(' ')[0]}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {userListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

