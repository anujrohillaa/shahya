'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  Sparkle
} from 'lucide-react';
import { FullPageLoader } from '@/components/ui/CustomLoader';
import ListingCard from '@/components/ListingCard';
import { ListingItem, UserProfile } from '@/lib/types';

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [userListings, setUserListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/listings?userId=${id}&status=ACTIVE`);
        if (res.ok) {
          const data = await res.json();
          setUserListings(data.listings || []);
          if (data.listings && data.listings.length > 0) {
            setProfileUser(data.listings[0].user);
          }
        }

        // If no listings or to get full user profile
        if (!profileUser) {
          const uRes = await fetch(`/api/auth/session`);
          if (uRes.ok) {
            const uData = await uRes.json();
            if (uData.user && uData.user.id === id) {
              setProfileUser(uData.user);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProfile();
  }, [id]);

  if (loading) {
    return <FullPageLoader message="Loading member profile & compatibility score..." />;
  }

  // Fallback user view if viewing profile
  const userToDisplay = profileUser || (currentUser?.id === id ? currentUser : null);

  if (!userToDisplay) {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">User Profile</h2>
        <p className="text-xs text-slate-500">Member profile details loaded.</p>
        <Link href="/explore" className="text-xs font-bold text-brand-600">Browse Listings</Link>
      </div>
    );
  }

  const isMe = currentUser?.id === userToDisplay.id;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8 pb-24 min-h-[calc(100dvh-4rem)]">
      
      {/* 1. PROFILE BANNER CARD */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-card space-y-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <img
              src={userToDisplay.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userToDisplay.name}`}
              alt={userToDisplay.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-brand-500/20 shadow-md flex-shrink-0"
            />
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {userToDisplay.name}{userToDisplay.age ? `, ${userToDisplay.age}` : ''}
                </h1>
                {userToDisplay.isPhoneVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Phone Verified
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {userToDisplay.occupation === 'WORKING_PROFESSIONAL' ? 'Working Professional' : userToDisplay.occupation === 'STUDENT' ? 'Student' : 'Independent'}
                  {userToDisplay.companyCollege && ` • ${userToDisplay.companyCollege}`}
                </span>
              </p>

              <p className="text-[11px] text-slate-400">
                Member since {new Date(userToDisplay.createdAt || Date.now()).getFullYear()}
              </p>
            </div>
          </div>

          {isMe && (
            <Link
              href="/profile/edit"
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Link>
          )}

        </div>

        {/* About Bio */}
        {userToDisplay.bio && (
          <div className="pt-4 border-t border-slate-100 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">About Me</span>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {userToDisplay.bio}
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
              {userToDisplay.smoking === 'NO'
                ? '🚭 Non-Smoker'
                : userToDisplay.smoking === 'YES'
                ? '🚬 Smoker'
                : userToDisplay.smoking === 'OCCASIONALLY'
                ? '💨 Occasionally'
                : <span className="text-slate-400 font-medium">Not set</span>}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Food / Diet</span>
            <p className="text-xs font-bold text-slate-800">
              {userToDisplay.foodPreference === 'VEG'
                ? '🥗 Vegetarian'
                : userToDisplay.foodPreference === 'NON_VEG'
                ? '🍗 Non-Vegetarian'
                : userToDisplay.foodPreference === 'BOTH'
                ? '🍲 Both / Flexible'
                : <span className="text-slate-400 font-medium">Not set</span>}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sleep Schedule</span>
            <p className="text-xs font-bold text-slate-800">
              {userToDisplay.sleepSchedule === 'EARLY'
                ? '☀️ Early Riser'
                : userToDisplay.sleepSchedule === 'LATE'
                ? '🌙 Night Owl'
                : userToDisplay.sleepSchedule === 'FLEXIBLE'
                ? '⏰ Flexible'
                : <span className="text-slate-400 font-medium">Not set</span>}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cleanliness</span>
            <p className="text-xs font-bold text-slate-800">
              {userToDisplay.cleanliness === 'VERY_IMPORTANT'
                ? '✨ Very Organized'
                : userToDisplay.cleanliness === 'NORMAL'
                ? '🧹 Normal'
                : userToDisplay.cleanliness === 'FLEXIBLE'
                ? '🛋️ Flexible'
                : <span className="text-slate-400 font-medium">Not set</span>}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pets</span>
            <p className="text-xs font-bold text-slate-800">
              {userToDisplay.pets === 'HAVE_PETS'
                ? '🐶 Has Pets'
                : userToDisplay.pets === 'OKAY_WITH_PETS'
                ? '🐾 Okay with Pets'
                : userToDisplay.pets === 'NOT_OKAY'
                ? '❌ No Pets'
                : <span className="text-slate-400 font-medium">Not set</span>}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Flatmate Preference</span>
            <p className="text-xs font-bold text-slate-800">
              {userToDisplay.genderPreference === 'MALE'
                ? '👨 Male Only'
                : userToDisplay.genderPreference === 'FEMALE'
                ? '👩 Female Only'
                : userToDisplay.genderPreference === 'ANY'
                ? '👥 Any Gender'
                : <span className="text-slate-400 font-medium">Not set</span>}
            </p>
          </div>

        </div>
      </div>


      {/* 3. ACTIVE LISTINGS BY USER */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Listings by {userToDisplay.name.split(' ')[0]} ({userListings.length})
        </h3>

        {userListings.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
            No active listings currently posted by this user.
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
