'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    // Simulate support ticket submission
    await new Promise(r => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
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
        
        {/* Left Column: Contact Details */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Have a question, feedback, or need help with a listing? Our team is here to support you.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex-shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Support Email</span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">support@shahya.com</p>
                <p className="text-[11px] text-slate-500">Responses within 24 hours</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex-shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Moderation & Safety</span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">safety@shahya.com</p>
                <p className="text-[11px] text-slate-500">Report spam, scam, or fake listings</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Locations Supported</span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Delhi NCR, Gurgaon, Manesar & Top Metros</p>
                <p className="text-[11px] text-slate-500">Pan-India coverage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-card">
            
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out, <strong>{name}</strong>. Our support team will respond to <strong>{email}</strong> shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setName(''); setEmail(''); setSubject(''); setMessage(''); }}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">Send us a Message</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill out the form below and our team will get back to you promptly.
                  </p>
                </div>

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
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Feedback on Listing in Manesar / Account Help"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="How can we help you today? Please share as much detail as possible..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
