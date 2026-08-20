'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  unreadMessagesCount: number;
  notificationsCount: number;
  refreshSession: () => Promise<void>;
  switchDemoUser: (roleOrEmail: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  unreadMessagesCount: 0,
  notificationsCount: 0,
  refreshSession: async () => {},
  switchDemoUser: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const router = useRouter();

  // Instant client cache hydration
  useEffect(() => {
    try {
      const cached = localStorage.getItem('shahya_user');
      if (cached) {
        setUser(JSON.parse(cached));
        setLoading(false);
      }
    } catch (e) {}
  }, []);

  const refreshSession = async () => {
    try {
      const res = await fetch('/api/auth/session', {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user) {
          localStorage.setItem('shahya_user', JSON.stringify(data.user));
        } else {
          localStorage.removeItem('shahya_user');
        }
        setUnreadMessagesCount(data.unreadMessagesCount || 0);
        setNotificationsCount(data.notificationsCount || 0);
      } else {
        setUser(null);
        localStorage.removeItem('shahya_user');
      }
    } catch (e) {
      console.warn('Session refresh error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();

    // Listen to real-time events via SSE
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/messages/stream');
      
      eventSource.addEventListener('message', (event) => {
        try {
          const msg = JSON.parse(event.data);
          // If message is for another conversation, increment unread count
          setUnreadMessagesCount(prev => prev + 1);
        } catch (err) {}
      });

      eventSource.addEventListener('notification', (event) => {
        try {
          setNotificationsCount(prev => prev + 1);
        } catch (err) {}
      });
    } catch (err) {}

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const switchDemoUser = async (roleOrEmail: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleOrEmail }),
      });
      if (res.ok) {
        await refreshSession();
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await switchDemoUser('logout');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        unreadMessagesCount,
        notificationsCount,
        refreshSession,
        switchDemoUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
