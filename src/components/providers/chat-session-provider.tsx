
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { ChatMessage } from '@/lib/types';

interface ChatSessionContextType {
  hasSessionStarted: boolean;
  messages: ChatMessage[];
  startSession: () => void;
  endSession: () => void;
  addMessage: (message: ChatMessage) => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  clearMessages: () => void;
}

const ChatSessionContext = createContext<ChatSessionContextType | undefined>(undefined);

export function ChatSessionProvider({ children }: { children: ReactNode }) {
  const [hasSessionStarted, setHasSessionStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // On logout, clear session
    if (!user) {
      endSession();
    }
  }, [user]);

  const startSession = () => {
    setHasSessionStarted(true);
  };

  const endSession = useCallback(() => {
    setHasSessionStarted(false);
    setMessages([]);
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatSessionContext.Provider value={{ hasSessionStarted, startSession, endSession, messages, addMessage, setMessages, clearMessages }}>
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
