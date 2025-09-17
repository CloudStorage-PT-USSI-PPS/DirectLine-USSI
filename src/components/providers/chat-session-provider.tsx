
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface ChatSessionContextType {
  hasSessionStarted: boolean;
  startSession: () => void;
  endSession: () => void;
}

const ChatSessionContext = createContext<ChatSessionContextType | undefined>(undefined);

export function ChatSessionProvider({ children }: { children: ReactNode }) {
  const [hasSessionStarted, setHasSessionStarted] = useState(false);
  const { user } = useAuth();

  // Reset session when user logs out
  useEffect(() => {
    if (!user) {
      setHasSessionStarted(false);
    }
  }, [user]);

  const startSession = () => {
    setHasSessionStarted(true);
  };

  const endSession = () => {
    setHasSessionStarted(false);
  };

  return (
    <ChatSessionContext.Provider value={{ hasSessionStarted, startSession, endSession }}>
      {children}
    </ChatSessionContext.Provider>
  );
}

export function useChatSession() {
  const context = useContext(ChatSessionContext);
  if (context === undefined) {
    throw new Error('useChatSession must be used within a ChatSessionProvider');
  }
  return context;
}
