'use client';

import { useAuth } from '@/hooks/use-auth';
import { ClientNavbar } from './client-navbar';
import { CsNavbar } from './cs-navbar';
import { AtasanNavbar } from './atasan-navbar';

export function Navbar() {
  const { user } = useAuth();

  if (!user) {
    return null; // or a loading state/fallback
  }

  // Render the appropriate navbar based on the user's role
  if (user.role === 'client') {
    return <ClientNavbar />;
  }

  if (user.role === 'cs') {
    return <CsNavbar />;
  }

  if (user.role === 'atasan') {
    return <AtasanNavbar />;
  }

  return null;
}
