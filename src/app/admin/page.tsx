'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import {
  ShieldCheck,
  Users,
  Home,
  Flag,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Check,
  X,
  Trash2,
  Ban,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

export default function AdminPanelPage() {
  const { user } = useAuth();
  const { confirm, success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'reports' | 'users' | 'listings'>('reports');

  // Stats
  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [listingsList, setListingsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [userSearch, setUserSearch] = useState('');
  const [reportStatusFilter, setReportStatusFilter] = useState('ALL');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Stats
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }

      // 2. Reports
      const repRes = await fetch('/api/admin/reports');
      if (repRes.ok) {
        const data = await repRes.json();
        setReports(data.reports || []);
      }

      // 3. Users
      const usersRes = await fetch('/api/admin/users');
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsersList(data.users || []);
      }

      // 4. Listings
      const listRes = await fetch('/api/admin/listings');
      if (listRes.ok) {
        const data = await listRes.json();
        setListingsList(data.listings || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleReportAction = async (reportId: string, status: string, action?: string) => {
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status, action }),
      });
      if (res.ok) {
        success(`Report marked as ${status.toLowerCase()}${action ? ` with action: ${action}` : ''}`);
        fetchAdminData();
      }
    } catch (e) {
      error('Failed to update report');
    }
  };

  const handleUserStatusToggle = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    confirm({
      title: newStatus === 'BANNED' ? 'Ban User' : 'Unban User',
      message: `Are you sure you want to ${newStatus === 'BANNED' ? 'ban this user? They will be immediately blocked from messaging and posting.' : 'unban this user and restore their account access?'}`,
      confirmText: newStatus === 'BANNED' ? 'Ban User' : 'Restore Access',
      type: newStatus === 'BANNED' ? 'danger' : 'primary',
      onConfirm: async () => {
        try {
          const res = await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, status: newStatus }),
          });
          if (res.ok) {
            success(`User status updated to ${newStatus}`);
            fetchAdminData();
          }
        } catch (e) {
          error('Failed to update user status');
        }
      },
    });
  };

  const handleUserVerifyToggle = async (userId: string, isPhoneVerified: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isPhoneVerified: !isPhoneVerified }),
      });
      if (res.ok) {
        success(!isPhoneVerified ? 'User marked as Phone Verified' : 'Phone verification badge removed');
        fetchAdminData();
      }
    } catch (e) {
      error('Failed to toggle verification');
    }
  };

  const handleListingStatusToggle = async (listingId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, status }),
      });
      if (res.ok) {
        success(`Listing status set to ${status}`);
        fetchAdminData();
      }
    } catch (e) {
      error('Failed to update listing status');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-4 my-12">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500">
          This portal is restricted to authorized platform administrators only.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  const filteredReports = reports.filter(r => {
    if (reportStatusFilter === 'ALL') return true;
    return r.status === reportStatusFilter;
  });

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
    (u.phone && u.phone.includes(userSearch))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Admin Moderation & Trust Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Platform Administration
          </h1>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>


      {/* KPI Metrics */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Users</span>
            <p className="text-2xl font-black text-slate-900">{stats.totalUsers}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Listings</span>
            <p className="text-2xl font-black text-emerald-600">{stats.activeListings}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Open Reports</span>
            <p className="text-2xl font-black text-rose-600">{stats.openReports}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Chats</span>
            <p className="text-2xl font-black text-brand-600">{stats.activeChats}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">New Today</span>
            <p className="text-2xl font-black text-indigo-600">{stats.newUsersToday}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Banned Users</span>
            <p className="text-2xl font-black text-slate-400">{stats.blockedUsersCount}</p>
          </div>
        </div>
      )}


      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-8 text-sm font-bold">
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'reports' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Moderation Reports ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'users' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'listings' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Listings Management ({listingsList.length})</span>
        </button>
      </div>


      {/* TAB 1: MODERATION REPORTS RESOLUTION WORKFLOW */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          
          <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
            {['ALL', 'NEW', 'UNDER_REVIEW', 'ACTION_TAKEN', 'RESOLVED'].map((st) => (
              <button
                key={st}
                onClick={() => setReportStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl border transition-all ${
                  reportStatusFilter === st
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-400">
              No reports in this category. All clear!
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        report.status === 'NEW'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : report.status === 'UNDER_REVIEW'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {report.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Reason: {report.reason.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      Reported on {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    {report.listing && (
                      <p>
                        <strong>Target Listing:</strong>{' '}
                        <Link href={`/listing/${report.listing.id}`} className="text-brand-600 hover:underline">
                          {report.listing.title} ({report.listing.city})
                        </Link>
                      </p>
                    )}
                    {report.reportedUser && (
                      <p>
                        <strong>Target User:</strong> {report.reportedUser.name} ({report.reportedUser.email})
                      </p>
                    )}
                    {report.description && (
                      <p className="italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        "{report.description}"
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400">
                      Reported by: {report.reporter?.name} ({report.reporter?.email})
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap justify-end">
                    {report.status === 'NEW' && (
                      <button
                        onClick={() => handleReportAction(report.id, 'UNDER_REVIEW')}
                        className="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold"
                      >
                        Mark Under Review
                      </button>
                    )}

                    {report.listingId && (
                      <button
                        onClick={() => handleReportAction(report.id, 'ACTION_TAKEN', 'REMOVE_LISTING')}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold"
                      >
                        Remove Listing
                      </button>
                    )}

                    <button
                      onClick={() => handleReportAction(report.id, 'ACTION_TAKEN', 'BAN_USER')}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold"
                    >
                      Ban User
                    </button>

                    <button
                      onClick={() => handleReportAction(report.id, 'RESOLVED')}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                    >
                      Dismiss / Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}


      {/* TAB 2: USER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user by name, email, phone..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email || u.phone}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleUserVerifyToggle(u.id, u.isPhoneVerified)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          u.isPhoneVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {u.isPhoneVerified ? 'Phone Verified' : 'Unverified'}
                      </button>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'ACTIVE' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                      }`}>
                        {u.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleUserStatusToggle(u.id, u.status)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                          u.status === 'ACTIVE'
                            ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Ban User' : 'Unban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* TAB 3: LISTINGS MODERATION */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Listing</th>
                <th className="p-4">Posted By</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listingsList.map((listing) => (
                <tr key={listing.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <Link href={`/listing/${listing.id}`} className="font-bold text-slate-900 hover:text-brand-600 block">
                      {listing.title}
                    </Link>
                    <span className="text-[11px] text-slate-400">{listing.locality}, {listing.city}</span>
                  </td>

                  <td className="p-4 font-medium text-slate-700">
                    {listing.user?.name}
                  </td>

                  <td className="p-4 font-bold text-slate-900">
                    ₹{listing.rent?.toLocaleString('en-IN')}/mo
                  </td>

                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      listing.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {listing.status}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    {listing.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleListingStatusToggle(listing.id, 'CLOSED')}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold"
                      >
                        Close
                      </button>
                    ) : (
                      <button
                        onClick={() => handleListingStatusToggle(listing.id, 'ACTIVE')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
