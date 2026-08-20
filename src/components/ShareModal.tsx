'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  MessageCircle,
  Send,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { useToast } from './ToastProvider';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  rent?: number;
  locality?: string;
  city?: string;
  coverImage?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  url,
  rent,
  locality,
  city,
  coverImage,
}: ShareModalProps) {
  const { success, error } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const locationText = [locality, city].filter(Boolean).join(', ');
  const rentText = rent ? `₹${rent.toLocaleString('en-IN')}/mo` : '';
  const shareText = `Check out this verified place on Shahya (${rentText ? `${rentText}, ` : ''}${locationText || 'Zero Brokerage'}): ${title}\n\n${shareUrl}`;

  // 1. WhatsApp Intent
  const handleWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  // 2. Telegram Intent
  const handleTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this room on Shahya: ${title}`)}`;
    window.open(tgUrl, '_blank');
  };

  // 3. SMS Intent
  const handleSMS = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(shareText)}`;
    window.location.href = smsUrl;
  };

  // 4. Native Mobile Web Share API (if available)
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Shahya`,
          text: `Verified zero-brokerage room on Shahya: ${title}`,
          url: shareUrl,
        });
        onClose();
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  // 5. Universal Copy to Clipboard
  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      success('Listing link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      error('Failed to copy link');
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-modal animate-modal-pop space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Share this Listing</h3>
              <p className="text-[11px] text-slate-400">Share with friends or flatmate groups</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listing Snippet Preview */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-slate-200 flex-shrink-0" />
          )}
          <div className="min-w-0 flex-1 space-y-0.5">
            <h4 className="text-xs font-bold text-slate-900 truncate">{title}</h4>
            <p className="text-[11px] text-brand-600 font-semibold truncate">
              {rentText} {locationText ? `• ${locationText}` : ''}
            </p>
            <span className="text-[10px] text-emerald-600 font-medium block">
              100% Free Direct Chat • Zero Brokerage
            </span>
          </div>
        </div>

        {/* Instant Share Grid */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Instant Share
          </span>

          <div className="grid grid-cols-3 gap-2.5">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-800 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xs font-bold">WhatsApp</span>
            </button>

            {/* Telegram */}
            <button
              onClick={handleTelegram}
              className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200/80 text-sky-800 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group"
            >
              <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Send className="w-4 h-4 ml-0.5" />
              </div>
              <span className="text-xs font-bold">Telegram</span>
            </button>

            {/* SMS / More Apps */}
            <button
              onClick={hasNativeShare ? handleNativeShare : handleSMS}
              className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 text-indigo-800 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">{hasNativeShare ? 'More Apps' : 'SMS'}</span>
            </button>
          </div>
        </div>

        {/* Copy Link Input Bar */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Copy Page Link
          </span>
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent px-2.5 text-xs text-slate-700 focus:outline-none truncate font-mono"
            />
            <button
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap active:scale-95 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
