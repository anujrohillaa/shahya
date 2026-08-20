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
  Check
} from 'lucide-react';
import EmojiPicker from './EmojiPicker';

interface ActiveChat {
  conversationId: string;
  otherUser: any;
  listing?: any;
  isMinimized: boolean;
}

export default function DesktopChatDock() {
  const { user } = useAuth();
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

  const messagesEndRefs = useRef<{ [convoId: string]: HTMLDivElement | null }>({});
  const dockPanelRef = useRef<HTMLDivElement>(null);

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
      fetchConversations();
    }
  }, [user]);

  // Realtime SSE listener for new messages
  useEffect(() => {
    if (!user) return;

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/messages/stream');
      eventSource.onmessage = (event) => {
        try {
          const newMsg = JSON.parse(event.data);
          if (newMsg && newMsg.conversationId) {
            setChatMessages((prev) => {
              const list = prev[newMsg.conversationId] || [];
              // 1. If message already exists by real ID, skip
              if (list.some((m) => m.id === newMsg.id)) return prev;

              // 2. If it matches a pending optimistic message, replace it
              const tempIdx = list.findIndex(
                (m) => m.id.startsWith('temp-') && m.senderId === newMsg.senderId && m.text === newMsg.text
              );
              if (tempIdx !== -1) {
                const updatedList = [...list];
                updatedList[tempIdx] = newMsg;
                return { ...prev, [newMsg.conversationId]: updatedList };
              }

              // 3. Otherwise append new incoming message
              return { ...prev, [newMsg.conversationId]: [...list, newMsg] };
            });
            fetchConversations();
          }
        } catch (err) {}
      };
    } catch (err) {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [user]);

  const openChatWindow = async (convo: any) => {
    const convoId = convo.id;
    const otherUser = convo.otherUser || (convo.user1Id === user?.id ? convo.user2 : convo.user1);

    // Check if already open
    if (activeChats.some((c) => c.conversationId === convoId)) {
      setActiveChats((prev) =>
        prev.map((c) => (c.conversationId === convoId ? { ...c, isMinimized: false } : c))
      );
    } else {
      // Keep at most 2 active floating chat boxes
      setActiveChats((prev) => [
        ...prev.slice(-1),
        {
          conversationId: convoId,
          otherUser,
          listing: convo.listing,
          isMinimized: false,
        },
      ]);
    }

    // Fetch messages for this conversation
    try {
      const res = await fetch(`/api/messages?conversationId=${convoId}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => ({
          ...prev,
          [convoId]: data.messages || [],
        }));
      }
    } catch (e) {
      console.error(e);
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

    // Optimistic message
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

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: convoId,
          text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => {
          const list = prev[convoId] || [];
          if (list.some((m) => m.id === data.message.id)) {
            return {
              ...prev,
              [convoId]: list.filter((m) => m.id !== tempId),
            };
          }
          return {
            ...prev,
            [convoId]: list.map((m) => (m.id === tempId ? data.message : m)),
          };
        });
        fetchConversations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || isIndividualChatPage) return null;

  const totalUnread = conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);

  const filteredConversations = conversations.filter((convo) => {
    const otherUser = convo.otherUser || (convo.user1Id === user?.id ? convo.user2 : convo.user1);
    const nameMatch = otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const titleMatch = convo.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || titleMatch;
  });

  return (
    <div className="fixed bottom-0 right-4 z-40 hidden md:flex items-end gap-3 pointer-events-none">
      
      {/* 1. ACTIVE FLOATING CHAT BOXES (Up to 2 side-by-side) */}
      {activeChats.map((chat) => {
        const convoId = chat.conversationId;
        const other = chat.otherUser || {};
        const listing = chat.listing;
        const messages = chatMessages[convoId] || [];
        const inputText = chatInputs[convoId] || '';

        return (
          <div
            key={convoId}
            className={`w-80 bg-white rounded-t-2xl border border-slate-200/90 shadow-modal flex flex-col pointer-events-auto transition-all duration-200 ${
              chat.isMinimized ? 'h-12' : 'h-[450px]'
            }`}
          >
            {/* Window Header */}
            <div
              onClick={() => toggleMinimize(convoId)}
              className="px-3.5 py-2 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between cursor-pointer select-none flex-shrink-0"
            >
              {/* Clickable Avatar & Name linking to User Profile */}
              <Link
                href={other?.id ? `/profile/${other.id}` : '#'}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-90 transition-opacity group"
                title={`View ${other?.name || 'User'}'s Profile`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={other?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${other?.name || 'User'}`}
                    alt={other?.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-white/30 group-hover:ring-brand-400 transition-all"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-slate-900" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs truncate block text-white group-hover:text-brand-300 transition-colors">
                      {other?.name || 'Room Host'}
                    </span>
                    {other?.isPhoneVerified && (
                      <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate leading-none">
                    {other?.occupation === 'WORKING_PROFESSIONAL'
                      ? 'Working Professional'
                      : other?.occupation === 'STUDENT'
                      ? 'Student'
                      : 'Verified Member'}
                  </span>
                </div>
              </Link>

              {/* Window Controls */}
              <div className="flex items-center gap-0.5 flex-shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                {/* View Profile Button */}
                {other?.id && (
                  <Link
                    href={`/profile/${other.id}`}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="View Member Profile"
                  >
                    <User className="w-3.5 h-3.5" />
                  </Link>
                )}

                {/* Minimize */}
                <button
                  type="button"
                  onClick={() => toggleMinimize(convoId)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title={chat.isMinimized ? 'Maximize' : 'Minimize'}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Open Full Screen */}
                <Link
                  href={`/messages/${convoId}`}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Open full chat screen"
                >
                  <Maximize2 className="w-3 h-3" />
                </Link>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => closeChatWindow(convoId)}
                  className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Close chat"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Window Content (When not minimized) */}
            {!chat.isMinimized && (
              <div className="flex-1 flex flex-col min-h-0 bg-slate-50 relative">
                
                {/* Attached Listing Bar */}
                {listing && (
                  <Link
                    href={`/listing/${listing.id}`}
                    className="flex-shrink-0 bg-brand-50 border-b border-brand-100 px-3 py-1.5 flex items-center justify-between gap-2 text-xs hover:bg-brand-100/70 transition-colors"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 truncate block text-[11px]">
                        {listing.title}
                      </span>
                      <span className="text-[10px] text-brand-800 font-semibold">
                        ₹{listing.rent?.toLocaleString('en-IN')}/mo • {listing.locality || listing.city}
                      </span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-brand-600 flex-shrink-0" />
                  </Link>
                )}

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs space-y-1">
                      <p className="font-semibold">Say hello to start chatting!</p>
                      <p className="text-[10px]">Zero brokerage • Verified connections</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMine = msg.senderId === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed break-words shadow-2xs ${
                              isMine
                                ? 'bg-brand-600 text-white rounded-br-xs'
                                : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                            }`}
                          >
                            <p className="whitespace-pre-line">{msg.text}</p>
                          </div>
                          <span className="text-[9px] text-slate-400 px-1 mt-0.5">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={(el) => { messagesEndRefs.current[convoId] = el; }} className="h-1" />
                </div>

                {/* Quick Replies (Only shown before first message) */}
                {messages.length === 0 && (
                  <div className="flex-shrink-0 bg-white border-t border-slate-100 px-2 py-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {['Is this room available?', 'When can I visit?', 'What is the deposit?'].map((g, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(convoId, g)}
                        className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-700 text-[10px] font-medium whitespace-nowrap transition-colors border border-slate-200/60"
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                )}

                {/* Composer Bar */}
                <div className="relative flex-shrink-0">
                  {emojiPickerConvoId === convoId && (
                    <div className="absolute bottom-full left-0 mb-1 z-50">
                      <EmojiPicker
                        onSelect={(emoji) => {
                          setChatInputs((prev) => ({
                            ...prev,
                            [convoId]: (prev[convoId] || '') + emoji,
                          }));
                        }}
                        onDelete={() => {
                          setChatInputs((prev) => {
                            const current = prev[convoId] || '';
                            const chars = Array.from(current);
                            return {
                              ...prev,
                              [convoId]: chars.slice(0, -1).join(''),
                            };
                          });
                        }}
                        onClose={() => setEmojiPickerConvoId(null)}
                      />
                    </div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage(convoId);
                    }}
                    className="p-2 bg-white border-t border-slate-200 flex items-center gap-1.5"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setEmojiPickerConvoId((prev) => (prev === convoId ? null : convoId))
                      }
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
                      title="Insert emoji"
                    >
                      <Smile className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={inputText}
                      onChange={(e) =>
                        setChatInputs((prev) => ({ ...prev, [convoId]: e.target.value }))
                      }
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white"
                    />

                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="p-1.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 transition-transform active:scale-95 flex-shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

              </div>
            )}

          </div>
        );
      })}


      {/* 2. CONVERSATIONS LIST PANEL (Facebook / LinkedIn Style) */}
      <div ref={dockPanelRef} className="w-72 bg-white rounded-t-2xl border border-slate-200/90 shadow-modal flex flex-col pointer-events-auto transition-all duration-200">
        
        {/* Launcher Header Tab */}
        <div
          onClick={() => setDockOpen((prev) => !prev)}
          className="px-4 py-2.5 bg-white border-b border-slate-100 rounded-t-2xl flex items-center justify-between cursor-pointer select-none shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-brand-500/30"
              />
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-600 ring-2 ring-white" />
              )}
            </div>
            <span className="text-xs font-bold text-slate-900">Messaging</span>
            {totalUnread > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-brand-600 text-white text-[10px] font-black">
                {totalUnread}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dockOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Expanded List Panel */}
        {dockOpen && (
          <div className="h-96 flex flex-col bg-white">
            
            {/* Search */}
            <div className="p-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 rounded-xl">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                  <p>No conversations found</p>
                  <Link href="/explore" className="text-brand-600 font-bold block">
                    Browse places to chat
                  </Link>
                </div>
              ) : (
                filteredConversations.map((convo) => {
                  const other = convo.otherUser || (convo.user1Id === user.id ? convo.user2 : convo.user1);
                  const isUnread = (convo.unreadCount || 0) > 0;

                  return (
                    <button
                      key={convo.id}
                      type="button"
                      onClick={() => openChatWindow(convo)}
                      className={`w-full text-left p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                        isUnread ? 'bg-brand-50/40' : ''
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={other?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${other?.name || 'User'}`}
                          alt={other?.name || 'User'}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        {isUnread && (
                          <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-brand-600 ring-2 ring-white" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs truncate ${isUnread ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                            {other?.name || 'Member'}
                          </h4>
                          <span className="text-[9px] text-slate-400 whitespace-nowrap">
                            {convo.lastMessageAt ? new Date(convo.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                          </span>
                        </div>

                        <p className={`text-[11px] truncate ${isUnread ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                          {convo.lastMessageText || 'Started conversation'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Bottom Footer */}
            <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
              <Link
                href="/messages"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
              >
                <span>Open All Messages</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
