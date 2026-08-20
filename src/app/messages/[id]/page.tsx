'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import {
  ArrowLeft,
  ShieldCheck,
  Send,
  Home,
  MoreVertical,
  Flag,
  CheckCheck,
  ShieldAlert,
  ChevronRight,
  Smile,
  Keyboard
} from 'lucide-react';
import ReportModal from '@/components/ReportModal';
import EmojiPicker from '@/components/EmojiPicker';

export default function ConversationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleToggleEmoji = () => {
    if (!emojiPickerOpen) {
      inputRef.current?.blur();
      setEmojiPickerOpen(true);
      setTimeout(() => scrollToBottom('smooth'), 100);
    } else {
      setEmojiPickerOpen(false);
      inputRef.current?.focus();
    }
  };

  // Visual Viewport tracking for mobile keyboard
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [viewportTop, setViewportTop] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click-outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  // Lock body scroll and track visual viewport height when keyboard opens/closes
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    const updateViewport = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
        setViewportTop(window.visualViewport.offsetTop);
      } else {
        setViewportHeight(window.innerHeight);
      }
    };

    updateViewport();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewport);
      window.visualViewport.addEventListener('scroll', updateViewport);
    } else {
      window.addEventListener('resize', updateViewport);
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.width = originalBodyWidth;

      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewport);
        window.visualViewport.removeEventListener('scroll', updateViewport);
      } else {
        window.removeEventListener('resize', updateViewport);
      }
    };
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    async function fetchConversation() {
      try {
        const res = await fetch(`/api/conversations/${id}`);
        if (res.ok) {
          const data = await res.json();
          setConversation(data.conversation);
          setMessages(data.conversation.messages || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchConversation();

    // Setup SSE listener for real-time messages
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/messages/stream');
      eventSource.addEventListener('message', (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.conversationId === id) {
            setMessages((prev) => {
              // 1. If message already exists by ID, do nothing
              if (prev.some((m) => m.id === msg.id)) return prev;

              // 2. If it matches a pending optimistic message from the same sender, replace it
              const tempIdx = prev.findIndex(
                (m) => m.id.startsWith('temp-') && m.senderId === msg.senderId && m.text === msg.text
              );
              if (tempIdx !== -1) {
                const copy = [...prev];
                copy[tempIdx] = msg;
                return copy;
              }

              // 3. Otherwise append new incoming message
              return [...prev, msg];
            });
            scrollToBottom();
          }
        } catch (e) {}
      });
    } catch (e) {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom('auto');
  }, [messages.length, viewportHeight]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || sending) return;

    if (!user) {
      router.push('/login');
      return;
    }

    setSending(true);
    setInputText('');

    // Keep mobile keyboard open and focused
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      conversationId: id,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      text: textToSend,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => {
      scrollToBottom();
      inputRef.current?.focus();
    }, 50);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: id,
          text: textToSend,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => {
          // If SSE already added the confirmed message, remove temp
          if (prev.some((m) => m.id === data.message.id)) {
            return prev.filter((m) => m.id !== tempId);
          }
          // Otherwise replace temp with confirmed message
          return prev.map((m) => (m.id === tempId ? data.message : m));
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
      // Re-focus to prevent keyboard dismissal
      inputRef.current?.focus();
    }
  };

  const quickGreetings = [
    "Hi, is this room still available?",
    "Can I visit to see the place this weekend?",
    "What are the maintenance & utility charges?",
    "When is the earliest move-in date?",
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Opening conversation...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-50 space-y-4 text-center">
        <p className="text-sm font-bold text-slate-700">Conversation not found</p>
        <Link
          href="/messages"
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm"
        >
          Back to Messages
        </Link>
      </div>
    );
  }

  const other = conversation.otherUser;
  const listing = conversation.listing;

  return (
    <div
      style={{
        height: viewportHeight ? `${viewportHeight}px` : '100dvh',
        top: `${viewportTop}px`,
      }}
      className="fixed inset-x-0 z-50 w-full flex flex-col bg-[#efeae2] sm:bg-slate-100 overflow-hidden select-none"
    >
      
      {/* 1. NATIVE CHAT HEADER (Stays permanently locked at top of visual viewport) */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200/90 px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3 shadow-xs z-30">
        
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Back button */}
          <Link
            href="/messages"
            className="p-1 -ml-1 rounded-full text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors flex-shrink-0"
            aria-label="Back to chats"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* User Avatar */}
          <Link href={`/profile/${other?.id}`} className="relative flex-shrink-0">
            <img
              src={other?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${other?.name}`}
              alt={other?.name}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </Link>

          {/* User Name & Status */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 leading-tight">
              <Link
                href={other?.id ? `/profile/${other.id}` : '#'}
                className="text-sm font-bold text-slate-900 truncate hover:text-brand-600 transition-colors"
              >
                {other?.name}
              </Link>
              {other?.isPhoneVerified && (
                <span title="Phone Verified" className="flex-shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
              {other?.occupation === 'WORKING_PROFESSIONAL' ? 'Working Professional' : other?.occupation === 'STUDENT' ? 'Student' : 'Verified Member'}
            </p>
          </div>
        </div>

        {/* Action Menu */}
        <div ref={menuRef} className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-floating border border-slate-100 py-1.5 z-50 animate-in fade-in">
              <Link
                href={`/profile/${other?.id}`}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                View Profile
              </Link>
              {listing && (
                <Link
                  href={`/listing/${listing.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View Listing Details
                </Link>
              )}
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={() => { setReportOpen(true); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report User</span>
              </button>
            </div>
          )}
        </div>

      </header>


      {/* 2. ATTACHED LISTING COMPACT BAR */}
      {listing && (
        <Link
          href={`/listing/${listing.id}`}
          className="flex-shrink-0 bg-brand-50 border-b border-brand-100 px-3 py-2 flex items-center justify-between gap-3 text-xs hover:bg-brand-100/70 transition-colors shadow-2xs z-20"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {listing.photos?.[0]?.url ? (
              <img
                src={listing.photos[0].url}
                alt={listing.title}
                className="w-10 h-8 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-8 rounded-lg bg-brand-200 flex items-center justify-center text-brand-700 flex-shrink-0">
                <Home className="w-4 h-4" />
              </div>
            )}

            <div className="min-w-0">
              <span className="font-bold text-slate-900 truncate block text-xs">
                {listing.title}
              </span>
              <span className="text-[11px] text-brand-800 font-medium whitespace-nowrap">
                ₹{listing.rent?.toLocaleString('en-IN')}/mo • {listing.locality}, {listing.city}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-0.5 text-[11px] font-bold text-brand-600 flex-shrink-0 whitespace-nowrap">
            <span>View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      )}


      {/* 3. MESSAGES SCROLL CONTAINER */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-3 bg-[#f8fafc]/90 sm:bg-slate-50/70">
        
        {/* Safety Tip Alert */}
        <div className="max-w-md mx-auto p-2.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-[11px] sm:text-xs flex items-start gap-2 shadow-2xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Safety Note:</strong> Never transfer token money or rent before in-person verification.
          </span>
        </div>

        {/* Message bubbles */}
        {messages.map((msg) => {
          const isMine = msg.senderId === user?.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs break-words ${
                  isMine
                    ? 'bg-brand-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="attachment"
                    className="mt-2 rounded-xl max-h-48 object-cover"
                  />
                )}
              </div>

              <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400 px-1">
                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {isMine && (
                  <CheckCheck className={`w-3 h-3 ${msg.isRead ? 'text-brand-500' : 'text-slate-400'}`} />
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} className="h-1" />
      </div>


      {/* 4. PRE-CANNED QUICK REPLIES BAR (Only shown for fresh conversations before any message is sent) */}
      {messages.length === 0 && (
        <div className="flex-shrink-0 bg-white border-t border-slate-100 px-3 py-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickGreetings.map((greet, idx) => (
            <button
              key={idx}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSendMessage(greet)}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-brand-50 active:bg-brand-100 hover:text-brand-700 text-slate-700 text-[11px] font-medium whitespace-nowrap transition-colors border border-slate-200/60"
            >
              {greet}
            </button>
          ))}
        </div>
      )}


      {/* 5. TEXT INPUT BAR WITH WHATSAPP-STYLE EMOJI TRAY & ANTI-AUTOFILL */}
      <div className="relative flex-shrink-0 z-30 bg-white border-t border-slate-200 shadow-lg">
        
        {/* Input Row */}
        <div className="px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2">
          
          {/* Emoji / Keyboard Toggle Button */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleToggleEmoji}
            className={`p-2 rounded-full transition-colors flex-shrink-0 ${
              emojiPickerOpen ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={emojiPickerOpen ? "Switch to keyboard" : "Choose emoji"}
          >
            {emojiPickerOpen ? (
              <Keyboard className="w-5 h-5" />
            ) : (
              <Smile className="w-5 h-5" />
            )}
          </button>

          {/* Message Input: Configured to prevent Android password manager / credit card toolbar */}
          <input
            ref={inputRef}
            type="search"
            inputMode="text"
            role="searchbox"
            id="chat_msg_input"
            name="chat_msg_field"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={() => {
              setEmojiPickerOpen(false);
              setTimeout(() => scrollToBottom('smooth'), 150);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            autoComplete="one-time-code"
            autoCorrect="off"
            autoCapitalize="sentences"
            spellCheck={false}
            enterKeyHint="send"
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />

          {/* Send Button */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || sending}
            className="w-10 h-10 rounded-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white flex items-center justify-center shadow-md transition-transform disabled:opacity-40 disabled:scale-100 active:scale-95 flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        {/* WhatsApp-Style Bottom Emoji Tray (Replaces virtual keyboard area) */}
        {emojiPickerOpen && (
          <div className="border-t border-slate-200 bg-white animate-in slide-in-from-bottom duration-200">
            <EmojiPicker
              fullWidth
              onSelect={(emoji) => {
                setInputText((prev) => prev + emoji);
              }}
              onDelete={() => {
                setInputText((prev) => {
                  const chars = Array.from(prev);
                  return chars.slice(0, -1).join('');
                });
              }}
              onClose={() => setEmojiPickerOpen(false)}
            />
          </div>
        )}

      </div>

      {/* Report Modal */}
      {reportOpen && (
        <ReportModal
          reportedUserId={other?.id}
          title={other?.name}
          onClose={() => setReportOpen(false)}
        />
      )}

    </div>
  );
}
