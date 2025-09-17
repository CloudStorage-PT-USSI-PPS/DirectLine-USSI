
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
  addMessages: (messages: ChatMessage[]) => void;
  clearMessages: () => void;
}

const ChatSessionContext = createContext<ChatSessionContextType | undefined>(undefined);

export function ChatSessionProvider({ children }: { children: ReactNode }) {
  const [hasSessionStarted, setHasSessionStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setHasSessionStarted(false);
      setMessages([]);
    }
  }, [user]);

  const startSession = () => {
    setHasSessionStarted(true);
  };

  const endSession = () => {
    setHasSessionStarted(false);
    setMessages([]);
  };

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);
  
  const addMessages = useCallback((newMessages: ChatMessage[]) => {
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  }, []);

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatSessionContext.Provider value={{ hasSessionStarted, startSession, endSession, messages, addMessage, addMessages, clearMessages }}>
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
