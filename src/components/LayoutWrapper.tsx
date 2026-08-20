'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';
import DesktopChatDock from '@/components/DesktopChatDock';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if we are in an active 1-on-1 chat screen (/messages/...)
  const isIndividualChat = pathname.startsWith('/messages/') && pathname !== '/messages';
  const isMessagesList = pathname === '/messages';

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Hide website navbar on 1-on-1 chat screens on mobile for pure native messenger UI */}
      {!isIndividualChat && <Navbar />}

      {/* Main Content: flex-1 so footer always stays at the bottom during loading */}
      <main className={`flex-1 flex flex-col w-full max-w-full overflow-x-hidden ${isIndividualChat ? 'h-[100dvh] overflow-hidden' : ''}`}>
        {children}
      </main>

      {/* Facebook-style Desktop Chat Dock on larger screens */}
      {!isIndividualChat && <DesktopChatDock />}

      {/* Mobile Bottom Nav: show only on main tabs, hide during 1-on-1 chat */}
      {!isIndividualChat && <MobileNav />}

      {/* Footer: hide on chat screens so it never crowds or jumps above empty lists */}
      {!isIndividualChat && !isMessagesList && <Footer />}
    </div>
  );
}
