import { UserProfile, ListingItem } from './types';

/**
 * Calculates a compatibility score (0 - 100%) between a viewer user and a listing / host
 */
export function calculateMatchScore(viewer: UserProfile | null | undefined, listing: ListingItem): number {
  if (!viewer) {
    // Default high base match for guest viewing based on listing quality & complete info
    let base = 85;
    if (listing.photos && listing.photos.length >= 3) base += 5;
    if (listing.amenities && listing.amenities.length >= 4) base += 5;
    return Math.min(95, base);
  }

  let score = 50; // baseline score

  // 1. Gender Preference Check (up to 15%)
  if (listing.preferredGender) {
    if (listing.preferredGender === 'ANY' || listing.preferredGender === viewer.gender) {
      score += 15;
    } else {
      score -= 20;
    }
  } else {
    score += 10;
  }

  // 2. Occupation Check (up to 10%)
  if (listing.preferredTenant) {
    if (listing.preferredTenant === 'ANY' || listing.preferredTenant === viewer.occupation) {
      score += 10;
    } else {
      score -= 5;
    }
  } else {
    score += 5;
  }

  // 3. Lifestyle Compatibility with Listing Owner (up to 25%)
  const owner = listing.user;
  if (owner) {
    // Food preference
    if (viewer.foodPreference && owner.foodPreference) {
      if (viewer.foodPreference === owner.foodPreference || viewer.foodPreference === 'BOTH' || owner.foodPreference === 'BOTH') {
        score += 7;
      }
    } else {
      score += 4;
    }

    // Smoking
    if (viewer.smoking && owner.smoking) {
      if (viewer.smoking === 'DONT_MIND' || owner.smoking === 'DONT_MIND' || viewer.smoking === owner.smoking) {
        score += 6;
      } else if (viewer.smoking === 'NO' && owner.smoking === 'YES') {
        score -= 10;
      }
    } else {
      score += 3;
    }

    // Pets
    if (viewer.pets && owner.pets) {
      if (viewer.pets === 'OKAY_WITH_PETS' || owner.pets === 'OKAY_WITH_PETS' || viewer.pets === owner.pets) {
        score += 6;
      } else if (viewer.pets === 'NOT_OKAY' && owner.pets === 'HAVE_PETS') {
        score -= 15;
      }
    } else {
      score += 3;
    }

    // Sleep Schedule
    if (viewer.sleepSchedule && owner.sleepSchedule) {
      if (viewer.sleepSchedule === owner.sleepSchedule || viewer.sleepSchedule === 'FLEXIBLE' || owner.sleepSchedule === 'FLEXIBLE') {
        score += 6;
      }
    } else {
      score += 3;
    }
  }

  // Clamp between 60% and 98%
  return Math.min(98, Math.max(62, Math.round(score)));
}
