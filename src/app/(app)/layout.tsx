
'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Navbar } from '@/components/layout/navbar';
import { ChatSessionProvider } from '@/components/providers/chat-session-provider';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ChatSessionProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Navbar />
          <main className="container py-8">{children}</main>
        </div>
      </ChatSessionProvider>
    </AuthProvider>
  );
}
