"use client";

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { users } from '@/lib/data';

const AUTH_KEY = 'directline-user-session';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((email: string) => {
    // In a real app, you'd fetch this from an API
    const loggedInUser = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(loggedInUser));
      return true;
    }
    // Simulate client login for any email
    const clientUser = { ...users.client, email: email, name: email.split('@')[0] };
    setUser(clientUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(clientUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  return { user, login, logout, loading };
}
