
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
    const predefinedUser = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (predefinedUser) {
      setUser(predefinedUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(predefinedUser));
      return true;
    }

    // Simulate client login for any other email
    const clientUser: User = { 
        id: `user-${Date.now()}`,
        email: email, 
        name: email.split('@')[0], 
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        role: 'client' 
    };
    setUser(clientUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(clientUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    // Also clear session storage related to chat
    // This is a bit of a hack, a better solution would involve a global state manager that resets on logout
    sessionStorage.clear();
  }, []);

  return { user, login, logout, loading };
}
