import type { ReactNode } from 'react';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Navbar } from '@/components/layout/navbar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <main className="container py-8">{children}</main>
      </div>
    </AuthProvider>
  );
}
