'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { ListingPhotoItem } from '@/lib/types';

interface PhotoGalleryModalProps {
  photos: ListingPhotoItem[];
  initialIndex?: number;
  onClose: () => void;
}

export default function PhotoGalleryModal({ photos, initialIndex = 0, onClose }: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const prev = () => setCurrentIndex((idx) => (idx === 0 ? photos.length - 1 : idx - 1));
  const next = () => setCurrentIndex((idx) => (idx === photos.length - 1 ? 0 : idx + 1));

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-6 backdrop-blur-md animate-in fade-in">
      
      {/* Header */}
      <div className="w-full max-w-5xl flex items-center justify-between text-white py-2">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Images className="w-4 h-4" />
          <span>Photo {currentIndex + 1} of {photos.length}</span>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image */}
      <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center min-h-0 py-2">
        <img
          src={photos[currentIndex]?.url}
          alt={`Photo ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
        />

        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition-all backdrop-blur-md"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition-all backdrop-blur-md"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row */}
      {photos.length > 1 && (
        <div className="w-full max-w-3xl flex items-center justify-center gap-2 overflow-x-auto py-3">
          {photos.map((photo, idx) => (
            <button
              key={photo.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex ? 'border-brand-500 scale-105 opacity-100 ring-2 ring-brand-400/50' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={photo.url} alt="thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
