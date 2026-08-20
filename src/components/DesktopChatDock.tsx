'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import {
  MessageSquare,
  X,
  Minus,
  Maximize2,
  Send,
  Smile,
  ShieldCheck,
  CheckCheck,
  ChevronRight,
  Home,
  Search,
  ExternalLink,
  ChevronDown,
  User,
  Check,
  Loader2,
  Sparkles
} from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import { soundManager } from '@/lib/notificationSound';

interface ActiveChat {
  conversationId: string;
  otherUser: any;
  listing?: any;
  isMinimized: boolean;
  isLoading?: boolean;
}

export default function DesktopChatDock() {
  const { user, setUnreadMessagesCount } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Don't show dock on dedicated mobile chat pages or if user not logged in
  const isIndividualChatPage = pathname.startsWith('/messages/') && pathname !== '/messages';

  const [dockOpen, setDockOpen] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);
  const [chatMessages, setChatMessages] = useState<{ [convoId: string]: any[] }>({});
  const [chatInputs, setChatInputs] = useState<{ [convoId: string]: string }>({});
  const [emojiPickerConvoId, setEmojiPickerConvoId] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(false);

  const messagesEndRefs = useRef<{ [convoId: string]: HTMLDivElement | null }>({});
  const dockPanelRef = useRef<HTMLDivElement>(null);

  // Total unread messages across all conversations
  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  // Close dock panel on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (dockPanelRef.current && !dockPanelRef.current.contains(e.target as Node)) {
        setDockOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const fetchConversations = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      setLoadingList(true);
      fetchConversations().finally(() => setLoadingList(false));
    }
  }, [user]);

  // Realtime SSE listener for new messages
  useEffect(() => {
    if (!user) return;

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/messages/stream');

      const handleIncoming = (raw: string) => {
        try {
          const data = JSON.parse(raw);
          if (data && data.conversationId && data.text) {
            const newMsg = data;
            
            // If from another user, play audio chime & desktop notification
            if (newMsg.senderId !== user.id) {
              soundManager.playMessageChime();
              soundManager.showDesktopNotification(
                newMsg.senderName ? `New message from ${newMsg.senderName}` : 'New message on Shahya',
                newMsg.text,
                newMsg.senderAvatar || '/icon.png',
                `/messages/${newMsg.conversationId}`
              );
            }

            setChatMessages((prev) => {
              const list = prev[newMsg.conversationId] || [];
              if (list.some((m) => m.id === newMsg.id)) return prev;

              const tempIdx = list.findIndex(
                (m) => m.id.startsWith('temp-') && m.senderId === newMsg.senderId && m.text === newMsg.text
              );
              if (tempIdx !== -1) {
                const updatedList = [...list];
                updatedList[tempIdx] = newMsg;
                return { ...prev, [newMsg.conversationId]: updatedList };
              }

              return { ...prev, [newMsg.conversationId]: [...list, newMsg] };
            });

            // Scroll active window to bottom
            setTimeout(() => {
              messagesEndRefs.current[newMsg.conversationId]?.scrollIntoView({ behavior: 'smooth' });
            }, 50);

            fetchConversations();
          }
        } catch {}
      };

      eventSource.onmessage = (e) => handleIncoming(e.data);
      eventSource.addEventListener('message', (e: any) => handleIncoming(e.data));
    } catch (err) {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [user]);

  const openChatWindow = async (convo: any) => {
    const convoId = convo.id;
    const otherUser = convo.otherUser || (convo.user1Id === user?.id ? convo.user2 : convo.user1);

    // 1. If already open, unminimize and focus
    if (activeChats.some((c) => c.conversationId === convoId)) {
      setActiveChats((prev) =>
        prev.map((c) => (c.conversationId === convoId ? { ...c, isMinimized: false } : c))
      );
    } else {
      // Keep at most 2 active floating chat boxes on screen
      setActiveChats((prev) => [
        ...prev.slice(-1),
        {
          conversationId: convoId,
          otherUser,
          listing: convo.listing,
          isMinimized: false,
          isLoading: !chatMessages[convoId],
        },
      ]);
    }

    // 2. Clear unread badge locally and globally
    setConversations((prev) => {
      const convo = prev.find((c) => c.id === convoId);
      if (convo && convo.unreadCount && convo.unreadCount > 0) {
        setUnreadMessagesCount(globalPrev => Math.max(0, globalPrev - convo.unreadCount!));
      }
      return prev.map((c) => (c.id === convoId ? { ...c, unreadCount: 0 } : c));
    });

    // 3. Fetch full message history for this conversation
    try {
      const res = await fetch(`/api/messages?conversationId=${convoId}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => ({
          ...prev,
          [convoId]: data.messages || [],
        }));
        setActiveChats((prev) =>
          prev.map((c) => (c.conversationId === convoId ? { ...c, isLoading: false } : c))
        );
        setTimeout(() => {
          messagesEndRefs.current[convoId]?.scrollIntoView({ behavior: 'auto' });
        }, 50);
      }
    } catch (e) {
      console.error(e);
      setActiveChats((prev) =>
        prev.map((c) => (c.conversationId === convoId ? { ...c, isLoading: false } : c))
      );
    }
  };

  const closeChatWindow = (convoId: string) => {
    setActiveChats((prev) => prev.filter((c) => c.conversationId !== convoId));
    if (emojiPickerConvoId === convoId) setEmojiPickerConvoId(null);
  };

  const toggleMinimize = (convoId: string) => {
    setActiveChats((prev) =>
      prev.map((c) => (c.conversationId === convoId ? { ...c, isMinimized: !c.isMinimized } : c))
    );
  };

  const handleSendMessage = async (convoId: string, customText?: string) => {
    const text = customText || chatInputs[convoId] || '';
    if (!text.trim()) return;

    // Clear input
    setChatInputs((prev) => ({ ...prev, [convoId]: '' }));
    setEmojiPickerConvoId(null);

    // Instant optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      conversationId: convoId,
      senderId: user?.id,
      text,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setChatMessages((prev) => ({
      ...prev,
      [convoId]: [...(prev[convoId] || []), optimisticMsg],
    }));

    setTimeout(() => {
      messagesEndRefs.current[convoId]?.scrollIntoView({ behavior: 'smooth' });
    }, 20);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: convoId, text }),
      });
      if (res.ok) {
        const data = await res.json();
        // Replace temp optimistic message with real ID
        setChatMessages((prev) => ({
          ...prev,
          [convoId]: (prev[convoId] || []).map((m) => (m.id === tempId ? data.message : m)),
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!user || isIndividualChatPage) return null;

  const filteredConversations = conversations.filter((c) => {
    const name = c.otherUser?.name || '';
    const listingTitle = c.listing?.title || '';
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || listingTitle.toLowerCase().includes(q);
  });

  return (
    <aside aria-label="Desktop Chat Dock" className="fixed bottom-0 right-4 z-40 hidden md:flex items-end gap-3 pointer-events-none">
      
      {/* 1. FLOATING ACTIVE CHAT BOXES (FACEBOOK MESSENGER STYLE) */}
      {activeChats.map((chat) => {
        const convoId = chat.conversationId;
        const messages = chatMessages[convoId] || [];
        const isMinimized = chat.isMinimized;
        const otherUser = chat.otherUser || { name: 'User' };
        const listing = chat.listing;

        return (
          <div
            key={convoId}
            className={`w-80 bg-white rounded-t-2xl shadow-2xl border border-slate-200/90 pointer-events-auto flex flex-col transition-all duration-200 overflow-hidden ${
              isMinimized ? 'h-12' : 'h-[440px]'
            }`}
          >
            {/* Window Header */}
            <div
              onClick={() => toggleMinimize(convoId)}
              className="px-3.5 py-2.5 bg-slate-900 text-white flex items-center justify-between cursor-pointer select-none hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={otherUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.name}`}
                    alt={otherUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-white/20"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate leading-tight">{otherUser.name}</p>
                  <p className="text-[10px] text-slate-300 truncate">
                    {listing ? `₹${listing.rent?.toLocaleString()} • ${listing.locality || listing.city}` : 'Direct Chat'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-300" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => toggleMinimize(convoId)}
                  className="p-1 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <Link
                  href={`/messages/${convoId}`}
                  className="p-1 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Open full page"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => closeChatWindow(convoId)}
                  className="p-1 hover:text-white hover:bg-rose-500 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Window Body (When Expanded) */}
            {!isMinimized && (
              <>
                {/* Optional Listing Mini-Card */}
                {listing && (
                  <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                      {listing.title}
                    </span>
                    <Link
                      href={`/listing/${listing.id}`}
                      target="_blank"
                      className="text-brand-600 hover:underline font-bold flex items-center gap-0.5"
                    >
                      <span>View</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                )}

                {/* Messages Scroll Area */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-50/40 text-xs">
                  {chat.isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                      <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                      <span className="text-[11px]">Loading chat history...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-4 space-y-1">
                      <MessageSquare className="w-6 h-6 text-slate-300" />
                      <p className="font-semibold text-slate-600">No messages yet</p>
                      <p className="text-[10px]">Say hi to start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((m, idx) => {
                      const isMe = m.senderId === user?.id;
                      return (
                        <div
                          key={m.id || idx}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[82%] px-3 py-2 rounded-2xl break-words leading-relaxed shadow-2xs ${
                              isMe
                                ? 'bg-brand-600 text-white rounded-br-xs'
                                : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                            }`}
                          >
                            <p className="text-[12px]">{m.text}</p>
                          </div>
                          <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={(el) => { messagesEndRefs.current[convoId] = el; }} />
                </div>

                {/* Emoji Picker Popup */}
                {emojiPickerConvoId === convoId && (
                  <div className="absolute bottom-14 left-2 z-50 shadow-2xl rounded-2xl">
                    <EmojiPicker
                      onSelect={(emoji) => {
                        setChatInputs((prev) => ({
                          ...prev,
                          [convoId]: (prev[convoId] || '') + emoji,
                        }));
                      }}
                      onClose={() => setEmojiPickerConvoId(null)}
                    />
                  </div>
                )}

                {/* Message Input Footer */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(convoId);
                  }}
                  className="p-2 border-t border-slate-200 bg-white flex items-center gap-1.5"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setEmojiPickerConvoId((prev) => (prev === convoId ? null : convoId))
                    }
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={chatInputs[convoId] || ''}
                    onChange={(e) =>
                      setChatInputs((prev) => ({ ...prev, [convoId]: e.target.value }))
                    }
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50 focus:bg-white"
                  />

                  <button
                    type="submit"
                    disabled={!chatInputs[convoId]?.trim()}
                    className="p-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white transition-all active:scale-95 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            )}
          </div>
        );
      })}

      {/* 2. DOCK MESSENGER LAUNCHER & EXPANDABLE LIST PANEL */}
      <div ref={dockPanelRef} className="relative pointer-events-auto">
        {dockOpen && (
          <div className="absolute bottom-14 right-0 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col h-[460px] animate-in slide-in-from-bottom-3 duration-200">
            {/* Panel Header */}
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Direct Messages</h3>
                  <p className="text-[10px] text-slate-400">Zero-brokerage instant chats</p>
                </div>
              </div>

              <Link
                href="/messages"
                className="text-[11px] font-bold text-brand-600 hover:underline flex items-center gap-0.5"
              >
                <span>Full Inbox</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Search Input */}
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/60">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search chats by name or place..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {loadingList ? (
                <div className="p-8 flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                  <span className="text-xs">Loading conversations...</span>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <p className="text-xs font-semibold text-slate-600">No conversations yet</p>
                  <p className="text-[11px] text-slate-400">
                    Search rooms or open a profile to chat with flatmates!
                  </p>
                  <Link
                    href="/explore"
                    onClick={() => setDockOpen(false)}
                    className="inline-block mt-2 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 font-bold text-xs"
                  >
                    Browse Places
                  </Link>
                </div>
              ) : (
                filteredConversations.map((c) => {
                  const other = c.otherUser || { name: 'User' };
                  const hasUnread = (c.unreadCount || 0) > 0;

                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        openChatWindow(c);
                        setDockOpen(false);
                      }}
                      className="p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={other.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${other.name}`}
                          alt={other.name}
                          className="w-10 h-10 rounded-2xl object-cover border border-slate-100 shadow-2xs"
                        />
                        {other.isPhoneVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 absolute -bottom-1 -right-1 bg-white rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs truncate ${hasUnread ? 'font-black text-slate-900' : 'font-bold text-slate-800'}`}>
                            {other.name}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                          </span>
                        </div>

                        <p className={`text-[11px] truncate mt-0.5 ${hasUnread ? 'font-bold text-brand-600' : 'text-slate-500'}`}>
                          {c.lastMessageText || 'Direct Conversation'}
                        </p>
                      </div>

                      {hasUnread && (
                        <span className="w-5 h-5 rounded-full bg-brand-600 text-white font-extrabold text-[10px] flex items-center justify-center flex-shrink-0 shadow-xs">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Panel Footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">⚡ Real-time active</span>
              <button
                type="button"
                onClick={() => setDockOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Floating Bubble Pill Launcher */}
        <button
          type="button"
          onClick={() => setDockOpen((prev) => !prev)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-floating border transition-all duration-300 active:scale-95 ${
            dockOpen
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200/90'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-brand-600 fill-brand-50" />
            {totalUnread > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs animate-pulse">
                {totalUnread}
              </span>
            )}
          </div>
          <span className="text-xs font-extrabold">Chats</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dockOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

    </aside>
  );
}
