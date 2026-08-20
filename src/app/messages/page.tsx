'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import {
  MessageSquare,
  ShieldCheck,
  Search,
  Home,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function MessagesListPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch('/api/conversations');
        if (res.ok) {
          const data = await res.json();
          setConversations(data.conversations || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();

    // SSE Realtime auto-refresh on new message
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/messages/stream');
      const refreshList = () => {
        fetchConversations();
      };
      eventSource.onmessage = refreshList;
      eventSource.addEventListener('message', refreshList);
    } catch {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  const filtered = conversations.filter(c => 
    (c.otherUser?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.listing?.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.listing?.locality || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6 pb-24 min-h-[calc(100dvh-4rem)] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Chats & Inquiries
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct real-time conversations with room hosts and flatmates
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, flat locality..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
        />
      </div>

      {/* Conversation List */}
      <div className="flex-1">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-white border border-slate-200/80 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-card space-y-4 my-auto">
            <div className="w-14 h-14 rounded-full bg-indigo-50 text-brand-600 flex items-center justify-center mx-auto">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No active chats</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Browse available rooms or flatmate profiles and tap "Chat Now" to start chatting directly.
            </p>
            <Link
              href="/explore"
              className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors"
            >
              Explore Listings
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card divide-y divide-slate-100 overflow-hidden">
            {filtered.map((convo) => (
              <Link
                key={convo.id}
                href={`/messages/${convo.id}`}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  
                  {/* User avatar with unread indicator */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={convo.otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${convo.otherUser?.name}`}
                      alt={convo.otherUser?.name}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    {convo.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                        {convo.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors truncate">
                          {convo.otherUser?.name}
                        </h4>
                        {convo.otherUser?.isPhoneVerified && (
                          <span title="Phone Verified">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 flex-shrink-0">
                        {convo.lastMessageAt ? new Date(convo.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    {/* Attached Listing Mini Tag */}
                    {convo.listing && (
                      <div className="text-[11px] text-brand-700 font-semibold truncate flex items-center gap-1">
                        <Home className="w-3 h-3 flex-shrink-0 text-brand-600" />
                        <span className="truncate">{convo.listing.title}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 truncate">
                      {convo.lastMessageText || 'Tap to view conversation'}
                    </p>
                  </div>

                </div>

                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 hidden sm:block" />
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
