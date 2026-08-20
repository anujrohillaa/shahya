'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { User, ShieldCheck, ArrowLeft, Save } from 'lucide-react';

export default function EditProfilePage() {
  const { user, refreshSession } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age ? String(user.age) : '');
  const [gender, setGender] = useState(user?.gender || 'MALE');
  const [occupation, setOccupation] = useState(user?.occupation || 'WORKING_PROFESSIONAL');
  const [companyCollege, setCompanyCollege] = useState(user?.companyCollege || '');
  const [bio, setBio] = useState(user?.bio || '');

  // Lifestyle
  const [smoking, setSmoking] = useState(user?.smoking || 'NO');
  const [drinking, setDrinking] = useState(user?.drinking || 'OCCASIONALLY');
  const [foodPreference, setFoodPreference] = useState(user?.foodPreference || 'VEG');
  const [sleepSchedule, setSleepSchedule] = useState(user?.sleepSchedule || 'FLEXIBLE');
  const [cleanliness, setCleanliness] = useState(user?.cleanliness || 'VERY_IMPORTANT');
  const [pets, setPets] = useState(user?.pets || 'OKAY_WITH_PETS');
  const [genderPreference, setGenderPreference] = useState(user?.genderPreference || 'ANY');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          age,
          gender,
          occupation,
          companyCollege,
          bio,
          smoking,
          drinking,
          foodPreference,
          sleepSchedule,
          cleanliness,
          pets,
          genderPreference,
        }),
      });

      if (res.ok) {
        await refreshSession();
        setMessage('Profile updated successfully!');
        setTimeout(() => router.push(`/profile/${user?.id}`), 1000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6 pb-24">
      
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Profile</span>
      </button>

      <div className="bg-white p-4 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card space-y-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Edit Profile & Lifestyle</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your lifestyle preferences help flatmates evaluate compatibility scores accurately.
          </p>
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Occupation
              </label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="WORKING_PROFESSIONAL">Working Professional</option>
                <option value="STUDENT">Student</option>
                <option value="SELF_EMPLOYED">Self-Employed / Founder</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Company / University
              </label>
              <input
                type="text"
                placeholder="e.g. Google, Flipkart, Symbiosis"
                value={companyCollege}
                onChange={(e) => setCompanyCollege(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              About Me (Bio)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A few words about your lifestyle, hobbies, routine..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Lifestyle Preferences</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Smoking</label>
                <select
                  value={smoking}
                  onChange={(e) => setSmoking(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="NO">Non-Smoker</option>
                  <option value="OCCASIONALLY">Occasionally</option>
                  <option value="YES">Smoker</option>
                  <option value="DONT_MIND">Don't Mind</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Diet / Food</label>
                <select
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="VEG">Vegetarian</option>
                  <option value="NON_VEG">Non-Vegetarian</option>
                  <option value="BOTH">Both / Any</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Sleep Schedule</label>
                <select
                  value={sleepSchedule}
                  onChange={(e) => setSleepSchedule(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="EARLY">Early Riser</option>
                  <option value="LATE">Night Owl</option>
                  <option value="FLEXIBLE">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Pets</label>
                <select
                  value={pets}
                  onChange={(e) => setPets(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="OKAY_WITH_PETS">Okay with Pets</option>
                  <option value="HAVE_PETS">Have Pets</option>
                  <option value="NOT_OKAY">Not Okay</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Cleanliness</label>
                <select
                  value={cleanliness}
                  onChange={(e) => setCleanliness(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="VERY_IMPORTANT">Very Organized</option>
                  <option value="NORMAL">Normal</option>
                  <option value="FLEXIBLE">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Flatmate Gender</label>
                <select
                  value={genderPreference}
                  onChange={(e) => setGenderPreference(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="ANY">Any Gender</option>
                  <option value="MALE">Male Only</option>
                  <option value="FEMALE">Female Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-2 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
