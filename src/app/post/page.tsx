'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import {
  Home,
  Users,
  MapPin,
  IndianRupee,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  Wifi,
  Wind,
  Tv,
  Car,
  Dumbbell,
  Shield,
  Zap,
  Coffee,
  Check,
  Upload,
  Crop,
  Star
} from 'lucide-react';
import ImageCropperModal from '@/components/ImageCropperModal';

export default function PostListingPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Wizard Step (1: Intent, 2: Specs, 3: Location & Rent, 4: Amenities & Lifestyle, 5: Photos & Publish)
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [intent, setIntent] = useState<'HAVE_PLACE' | 'NEED_PLACE'>('HAVE_PLACE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('APARTMENT');
  const [roomType, setRoomType] = useState('PRIVATE_ROOM');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('3');
  const [currentLiving, setCurrentLiving] = useState('2');
  const [vacancies, setVacancies] = useState('1');

  // Location
  const [city, setCity] = useState('Gurgaon');
  const [locality, setLocality] = useState('');
  const [landmark, setLandmark] = useState('');
  const [address, setAddress] = useState('');

  // Financials
  const [rent, setRent] = useState('');
  const [minBudget, setMinBudget] = useState('10000');
  const [maxBudget, setMaxBudget] = useState('18000');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [utilityEstimate, setUtilityEstimate] = useState('1200');

  // Availability & Preferences
  const [moveInImmediate, setMoveInImmediate] = useState(true);
  const [availableFrom, setAvailableFrom] = useState('');
  const [minimumStay, setMinimumStay] = useState('3_MONTHS');
  const [preferredGender, setPreferredGender] = useState('ANY');
  const [preferredTenant, setPreferredTenant] = useState('WORKING_PROFESSIONAL');

  // Amenities & Lifestyle tags
  const [amenities, setAmenities] = useState<string[]>([
    'WIFI',
    'AC',
    'WASHING_MACHINE',
    'REFRIGERATOR',
    'KITCHEN',
    'POWER_BACKUP',
  ]);

  const [preferences, setPreferences] = useState<string[]>([
    'NON_SMOKER',
    'CLEAN_HABITS',
  ]);

  // Photos State & Cropper
  const [photos, setPhotos] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageToCrop, setCurrentImageToCrop] = useState<string | null>(null);
  const [pendingQueue, setPendingQueue] = useState<string[]>([]);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const toggleAmenity = (name: string) => {
    setAmenities(prev => prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]);
  };

  const togglePreference = (tag: string) => {
    setPreferences(prev => prev.includes(tag) ? prev.filter(p => p !== tag) : [...prev, tag]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const readers = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(dataUrls => {
      if (dataUrls.length > 0) {
        setCurrentImageToCrop(dataUrls[0]);
        setPendingQueue(dataUrls.slice(1));
        setEditingPhotoIndex(null);
        setCropModalOpen(true);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    if (editingPhotoIndex !== null) {
      setPhotos(prev => {
        const updated = [...prev];
        updated[editingPhotoIndex] = croppedDataUrl;
        return updated;
      });
      setEditingPhotoIndex(null);
      setCropModalOpen(false);
      setCurrentImageToCrop(null);
    } else {
      setPhotos(prev => [...prev, croppedDataUrl]);
      if (pendingQueue.length > 0) {
        setCurrentImageToCrop(pendingQueue[0]);
        setPendingQueue(prev => prev.slice(1));
      } else {
        setCropModalOpen(false);
        setCurrentImageToCrop(null);
      }
    }
  };

  const handleEditPhotoCrop = (idx: number) => {
    setEditingPhotoIndex(idx);
    setCurrentImageToCrop(photos[idx]);
    setCropModalOpen(true);
  };

  const handleSetCoverPhoto = (idx: number) => {
    if (idx === 0) return;
    setPhotos(prev => {
      const selected = prev[idx];
      const rest = prev.filter((_, i) => i !== idx);
      return [selected, ...rest];
    });
  };

  const handleAddPhotoFromUrl = () => {
    if (newPhotoUrl.trim()) {
      setCurrentImageToCrop(newPhotoUrl.trim());
      setEditingPhotoIndex(null);
      setCropModalOpen(true);
      setNewPhotoUrl('');
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (publishStatus: 'ACTIVE' | 'DRAFT') => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!title || !city || !locality) {
      setError('Please fill in the title, city, and locality');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        type: intent,
        title,
        description,
        propertyType: intent === 'HAVE_PLACE' ? propertyType : undefined,
        roomType: intent === 'HAVE_PLACE' ? roomType : undefined,
        bedrooms: intent === 'HAVE_PLACE' ? bedrooms : undefined,
        bathrooms: intent === 'HAVE_PLACE' ? bathrooms : undefined,
        currentLiving: intent === 'HAVE_PLACE' ? currentLiving : undefined,
        vacancies: intent === 'HAVE_PLACE' ? vacancies : undefined,
        rent: intent === 'HAVE_PLACE' ? rent : maxBudget,
        minBudget: intent === 'NEED_PLACE' ? minBudget : undefined,
        maxBudget: intent === 'NEED_PLACE' ? maxBudget : undefined,
        securityDeposit: intent === 'HAVE_PLACE' ? (securityDeposit || parseInt(rent) * 2) : 0,
        utilityEstimate: intent === 'HAVE_PLACE' ? utilityEstimate : 0,
        city,
        locality,
        landmark,
        address,
        moveInImmediate,
        availableFrom: availableFrom ? availableFrom : undefined,
        minimumStay,
        preferredGender,
        preferredTenant,
        amenities,
        preferences,
        photos,
        status: publishStatus,
      };

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/listing/${data.listing.id}`);
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to create listing');
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 pb-24 w-full max-w-full overflow-x-hidden">
      
      {/* Wizard Progress Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-50 text-brand-700 border border-brand-200">
          Zero Brokerage • 100% Free
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {intent === 'HAVE_PLACE' ? 'Post Your Room or Flat' : 'Post Flatmate Seeker Profile'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Connect directly with verified room seekers and flatmates across India.
        </p>

        {/* Steps Bar */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-10 bg-brand-600'
                  : s < step
                  ? 'w-6 bg-brand-200'
                  : 'w-4 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          {error}
        </div>
      )}


      {/* STEP 1: INTENT SELECTION */}
      {step === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <h2 className="text-lg font-bold text-slate-900">What are you looking to do?</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Option A: Have a Place */}
            <div
              onClick={() => setIntent('HAVE_PLACE')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                intent === 'HAVE_PLACE'
                  ? 'border-brand-600 bg-brand-50/50 shadow-md ring-2 ring-brand-400/30'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">I Have a Place</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  I have a vacant room, flat, or shared space and want to find a flatmate or tenant.
                </p>
              </div>
            </div>

            {/* Option B: Need a Place */}
            <div
              onClick={() => setIntent('NEED_PLACE')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                intent === 'NEED_PLACE'
                  ? 'border-purple-600 bg-purple-50/50 shadow-md ring-2 ring-purple-400/30'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">I Need a Place</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  I'm looking for a room, flat, or compatible flatmate to rent together.
                </p>
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}


      {/* STEP 2: DETAILS & SPECS */}
      {step === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <h2 className="text-lg font-bold text-slate-900">
            {intent === 'HAVE_PLACE' ? 'Property & Room Details' : 'What type of room are you looking for?'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Listing Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={intent === 'HAVE_PLACE' ? "e.g. Spacious Private Room in 3BHK near Cyber City" : "e.g. Software Engineer looking for room in Indiranagar"}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {intent === 'HAVE_PLACE' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="APARTMENT">Apartment / Gated High-Rise</option>
                    <option value="BUILDER_FLOOR">Builder Floor</option>
                    <option value="INDEPENDENT_HOUSE">Independent House</option>
                    <option value="PG">Co-Living / PG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Room Type
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="PRIVATE_ROOM">Private Room</option>
                    <option value="SHARED_ROOM">Shared Room (2 sharing)</option>
                    <option value="ENTIRE_PROPERTY">Entire Flat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Bedrooms & Bathrooms
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="BHK (e.g. 3)"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="px-3.5 py-3 rounded-2xl border border-slate-200 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Baths (e.g. 3)"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="px-3.5 py-3 rounded-2xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Current Occupants & Vacancies
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Living (e.g. 2)"
                      value={currentLiving}
                      onChange={(e) => setCurrentLiving(e.target.value)}
                      className="px-3.5 py-3 rounded-2xl border border-slate-200 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Vacancies (e.g. 1)"
                      value={vacancies}
                      onChange={(e) => setVacancies(e.target.value)}
                      className="px-3.5 py-3 rounded-2xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Description / About
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the place, flatmates vibe, maid/cook status, metro distance, etc..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center gap-2 shadow-md"
            >
              <span>Next: Location & Price</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}


      {/* STEP 3: LOCATION & FINANCIALS */}
      {step === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Location & Financials</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Noida">Noida</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Locality / Area *
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Sector 43, Indiranagar, HSR Layout"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Nearby Landmark (Optional)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Millennium City Centre Metro / 100ft Road"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {intent === 'HAVE_PLACE' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Monthly Rent (₹) *
                  </label>
                  <input
                    type="number"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    placeholder="e.g. 14000"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    placeholder="e.g. 28000"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Estimated Utilities (₹/mo)
                  </label>
                  <input
                    type="number"
                    value={utilityEstimate}
                    onChange={(e) => setUtilityEstimate(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Minimum Budget (₹/mo)
                  </label>
                  <input
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Maximum Budget (₹/mo)
                  </label>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-brand-600"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center gap-2 shadow-md"
            >
              <span>Next: Amenities & Lifestyle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}


      {/* STEP 4: AMENITIES & LIFESTYLE PREFERENCES */}
      {step === 4 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Amenities & Lifestyle Match Rules</h2>

          {/* Preferences */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Preferred Flatmate Gender
                </label>
                <select
                  value={preferredGender}
                  onChange={(e) => setPreferredGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm bg-white"
                >
                  <option value="ANY">Any Gender</option>
                  <option value="MALE">Male Only</option>
                  <option value="FEMALE">Female Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Preferred Profession
                </label>
                <select
                  value={preferredTenant}
                  onChange={(e) => setPreferredTenant(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm bg-white"
                >
                  <option value="WORKING_PROFESSIONAL">Working Professional</option>
                  <option value="STUDENT">Student</option>
                  <option value="ANY">Any</option>
                </select>
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Available Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { name: 'WIFI', label: 'Wi-Fi' },
                  { name: 'AC', label: 'Air Conditioning' },
                  { name: 'WASHING_MACHINE', label: 'Washing Machine' },
                  { name: 'REFRIGERATOR', label: 'Refrigerator' },
                  { name: 'KITCHEN', label: 'Kitchen & Stove' },
                  { name: 'TV', label: 'Smart TV' },
                  { name: 'PARKING', label: 'Car/Bike Parking' },
                  { name: 'GYM', label: 'Gym' },
                  { name: 'GATED_SOCIETY', label: 'Gated Society' },
                  { name: 'POWER_BACKUP', label: 'Power Backup' },
                  { name: 'BALCONY', label: 'Balcony' },
                ].map((a) => (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => toggleAmenity(a.name)}
                    className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                      amenities.includes(a.name)
                        ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{a.label}</span>
                    {amenities.includes(a.name) && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Lifestyle Tags */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Lifestyle & Rules
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'NON_SMOKER',
                  'VEGETARIAN',
                  'PET_FRIENDLY',
                  'CLEAN_HABITS',
                  'QUIET_HOURS',
                  'EARLY_RISER',
                  'LATE_SLEEPER',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => togglePreference(tag)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      preferences.includes(tag)
                        ? 'bg-purple-50 border-purple-500 text-purple-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {preferences.includes(tag) ? '✓ ' : '+ '}
                    {tag.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center gap-2 shadow-md"
            >
              <span>Next: Photos & Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}


      {/* STEP 5: PHOTOS & PUBLISH */}
      {step === 5 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Photos & Publish</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload clear room photos. Photos are automatically cropped to the recommended 16:9 ratio.
              </p>
            </div>
            {photos.length > 0 && (
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'} Added
              </span>
            )}
          </div>

          <div className="space-y-5">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* 1. Main Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  const fakeEvent = { target: { files: e.dataTransfer.files } } as any;
                  handleFileSelect(fakeEvent);
                }
              }}
              className="p-8 sm:p-10 border-2 border-dashed border-slate-300 hover:border-brand-500 bg-slate-50/60 hover:bg-brand-50/20 rounded-3xl text-center cursor-pointer transition-all group flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-brand-600 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">
                  <span className="text-brand-600 underline">Click to upload</span> or drag and drop photos
                </p>
                <p className="text-xs text-slate-500">
                  Recommended size: <strong className="text-slate-700">16:9 Landscape</strong> • PNG, JPG, WEBP
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                <Crop className="w-3.5 h-3.5" />
                <span>Auto-crops to optimal card size • You can adjust framing</span>
              </div>
            </div>

            {/* 2. Uploaded Photos Grid */}
            {photos.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Uploaded Photos ({photos.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add More</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {photos.map((url, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-[16/9] rounded-2xl overflow-hidden border shadow-xs group bg-slate-900 ${
                        idx === 0 ? 'ring-2 ring-brand-500 border-brand-500' : 'border-slate-200'
                      }`}
                    >
                      <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      
                      {/* Cover Badge */}
                      {idx === 0 ? (
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg bg-brand-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-white" />
                          <span>Cover Photo</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetCoverPhoto(idx)}
                          className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-slate-900/80 text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900"
                        >
                          Set as Cover
                        </button>
                      )}

                      {/* Action buttons */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleEditPhotoCrop(idx)}
                          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white transition-colors"
                          title="Re-crop / Adjust Framing"
                        >
                          <Crop className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional URL input fallback */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Or paste an image web link (https://...)"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={handleAddPhotoFromUrl}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors whitespace-nowrap"
              >
                Add & Crop
              </button>
            </div>

            {/* Summary Review Pill */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 mt-4">
              <span className="font-bold text-slate-900 block text-sm">Listing Summary:</span>
              <p>• {title || 'Untitled'} in {locality || 'Location'}, {city}</p>
              <p>• {intent === 'HAVE_PLACE' ? `Rent: ₹${parseInt(rent || '0').toLocaleString('en-IN')}/month` : `Budget: ₹${minBudget} - ₹${maxBudget}/month`}</p>
              <p>• Zero Brokerage Guarantee • 30-Day Auto Renewal Lifecycle</p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm"
            >
              Back
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit('DRAFT')}
                className="w-1/2 sm:w-auto px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs"
              >
                Save as Draft
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit('ACTIVE')}
                className="w-1/2 sm:w-auto px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-extrabold text-sm shadow-md transition-all hover:scale-105"
              >
                {submitting ? 'Publishing...' : '🚀 Publish for Free'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. INTERACTIVE IMAGE CROPPER MODAL */}
      {cropModalOpen && currentImageToCrop && (
        <ImageCropperModal
          imageSrc={currentImageToCrop}
          aspectRatio={16 / 9}
          title={editingPhotoIndex !== null ? `Adjust Photo #${editingPhotoIndex + 1} Framing` : 'Crop & Frame Room Photo'}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setCropModalOpen(false);
            setCurrentImageToCrop(null);
            setEditingPhotoIndex(null);
            setPendingQueue([]);
          }}
        />
      )}

    </div>
  );
}
