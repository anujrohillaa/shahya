'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Phone, MapPin, Send, CheckCircle2, ArrowLeft, Sparkles, Clock, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    const formattedText = `Hi Shahya Support,\n\n*Name:* ${name}\n*Phone:* ${phone || 'Not provided'}\n*Topic:* ${subject || 'General Inquiry'}\n\n*Message:*\n${message}`;
    const encoded = encodeURIComponent(formattedText);
    const whatsappUrl = `https://wa.me/919817283155?text=${encoded}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Direct WhatsApp Contact Card */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              For fast assistance, user support, or listing queries, connect with our support team directly on WhatsApp.
            </p>
          </div>

          <div className="space-y-4">
            {/* Primary WhatsApp Card */}
            <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white p-6 rounded-3xl border border-emerald-800/80 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <MessageCircle className="w-6 h-6 fill-white" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
                  Active Support
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  Official WhatsApp Support
                </span>
                <p className="text-xl font-extrabold text-white tracking-tight">
                  +91 9817283155
                </p>
                <p className="text-xs text-emerald-200/80">
                  (WhatsApp Messages Only)
                </p>
              </div>

              <a
                href="https://wa.me/919817283155?text=Hi%20Shahya%20Team,%20I%20have%20a%20question%20regarding%20the%20platform."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-center"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>

            {/* Support Hours Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Response Time</span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Immediate / Within Few Hours</p>
                <p className="text-[11px] text-slate-500">Mon - Sun (9:00 AM - 9:00 PM)</p>
              </div>
            </div>

            {/* Coverage Areas */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Locations Covered</span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Manesar, Gurgaon, Delhi NCR & Metros</p>
                <p className="text-[11px] text-slate-500">Zero brokerage network</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Direct WhatsApp Message Composer */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-card space-y-6">
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant WhatsApp Message</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Send Direct Message to +91 9817283155</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Type your inquiry below and click Send to open a pre-formatted conversation on WhatsApp.
              </p>
            </div>

            <form onSubmit={handleWhatsAppSend} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Your Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Topic / Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Question about listing in Manesar / Need flatmate in Gurgaon"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Type your message here... When you click 'Send via WhatsApp', this will open WhatsApp directly with our support number +91 9817283155."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  💬 Direct Chat with Admin / Support Team
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send via WhatsApp (+91 9817283155)</span>
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
