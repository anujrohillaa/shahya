export type UserRole = 'USER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED';

export type ListingType = 'HAVE_PLACE' | 'NEED_PLACE';
export type PropertyType = 'APARTMENT' | 'INDEPENDENT_HOUSE' | 'BUILDER_FLOOR' | 'PG' | 'HOSTEL' | 'OTHER';
export type RoomType = 'PRIVATE_ROOM' | 'SHARED_ROOM' | 'ENTIRE_PROPERTY' | 'PG';
export type ListingStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'EXPIRED';

export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER' | 'ANY';
export type Occupation = 'STUDENT' | 'WORKING_PROFESSIONAL' | 'SELF_EMPLOYED' | 'OTHER' | 'ANY';
export type HabitPreference = 'NO' | 'OCCASIONALLY' | 'YES' | 'DONT_MIND';
export type FoodPreference = 'VEG' | 'NON_VEG' | 'BOTH';
export type SleepSchedule = 'EARLY' | 'LATE' | 'FLEXIBLE';
export type Cleanliness = 'VERY_IMPORTANT' | 'NORMAL' | 'FLEXIBLE';
export type PetPreference = 'HAVE_PETS' | 'OKAY_WITH_PETS' | 'NOT_OKAY';
export type MinimumStay = '1_MONTH' | '3_MONTHS' | '6_MONTHS' | 'FLEXIBLE';

export type ReportReason = 
  | 'SCAM'
  | 'FAKE_PROPERTY'
  | 'ALREADY_RENTED'
  | 'INCORRECT_INFO'
  | 'INAPPROPRIATE'
  | 'HARASSMENT'
  | 'DUPLICATE'
  | 'OTHER';

export type ReportStatus = 'NEW' | 'UNDER_REVIEW' | 'ACTION_TAKEN' | 'RESOLVED';

export interface UserProfile {
  id: string;
  email?: string | null;
  phone?: string | null;
  name: string;
  avatar?: string | null;
  age?: number | null;
  gender?: Gender | null;
  occupation?: Occupation | null;
  companyCollege?: string | null;
  bio?: string | null;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isIdVerified: boolean;
  role: UserRole;
  status: UserStatus;
  
  // Lifestyle
  smoking?: HabitPreference | null;
  drinking?: HabitPreference | null;
  foodPreference?: FoodPreference | null;
  sleepSchedule?: SleepSchedule | null;
  cleanliness?: Cleanliness | null;
  pets?: PetPreference | null;
  genderPreference?: Gender | null;
  
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface ListingPhotoItem {
  id: string;
  url: string;
  isCover: boolean;
  order: number;
}

export interface ListingItem {
  id: string;
  userId: string;
  user?: UserProfile;
  type: ListingType;
  title: string;
  description: string;
  
  propertyType?: PropertyType | null;
  roomType?: RoomType | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  currentLiving?: number | null;
  vacancies?: number;
  
  rent: number;
  minBudget?: number | null;
  maxBudget?: number | null;
  securityDeposit?: number;
  utilityEstimate?: number;
  brokerage: number; // 0
  
  city: string;
  locality: string;
  landmark?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  
  availableFrom?: string | Date | null;
  moveInImmediate: boolean;
  minimumStay?: MinimumStay | null;
  preferredGender?: Gender | null;
  preferredTenant?: Occupation | null;
  
  status: ListingStatus;
  viewsCount: number;
  expiresAt?: string | Date | null;
  
  photos: ListingPhotoItem[];
  amenities: string[];
  preferences: string[];
  
  createdAt: string | Date;
  updatedAt?: string | Date;
  
  // Computed in client / API
  isSaved?: boolean;
  matchScore?: number;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  text: string;
  imageUrl?: string | null;
  isRead: boolean;
  createdAt: string | Date;
}

export interface ConversationItem {
  id: string;
  listingId: string;
  listing?: ListingItem;
  otherUser: UserProfile;
  lastMessageText?: string | null;
  lastMessageAt: string | Date;
  unreadCount: number;
  messages?: MessageItem[];
  createdAt: string | Date;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporter?: UserProfile;
  listingId?: string | null;
  listing?: ListingItem | null;
  reportedUserId?: string | null;
  reportedUser?: UserProfile | null;
  reason: ReportReason;
  description?: string | null;
  status: ReportStatus;
  adminNotes?: string | null;
  createdAt: string | Date;
}
