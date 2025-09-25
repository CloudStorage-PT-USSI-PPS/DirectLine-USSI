'use client';

import { useEffect, useRef } from 'react';
import { Bot, Paperclip } from 'lucide-react';
import type { ChatMessage, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardContent } from '@/components/ui/card';

interface ChatBoxProps {
  messages: ChatMessage[];
  currentUser: User;
  csUser: User;
  isCsTyping: boolean;
}

export function ChatBox({ messages, currentUser, csUser, isCsTyping }: ChatBoxProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isCsTyping]);

  return (
    <CardContent className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollAreaRef}>
      <div className="space-y-6">
        {messages.map((message) => {
          const isClient = message.author === 'client';
          const isSystem = message.author === 'system';
          const authorUser = isClient ? currentUser : csUser;

          if (isSystem) {
            return (
              <div key={message.id} className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Bot className="h-4 w-4" />
                <span className="max-w-md text-center">{message.content}</span>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={cn(
                'flex items-end gap-3',
                isClient ? 'justify-end' : 'justify-start'
              )}
            >
              {!isClient && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={authorUser.avatar} alt={authorUser.name} />
                  <AvatarFallback>{authorUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 shadow-md',
                  isClient
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-card text-foreground rounded-bl-none border'
                )}
              >
                <p className="text-sm">{message.content}</p>
                {message.file && (
                    <div className="mt-2 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 p-2 text-xs">
                        <Paperclip className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{message.file.name}</span>
                    </div>
                )}
                <p className="mt-1 text-xs text-right opacity-70">{message.timestamp}</p>
              </div>
              {isClient && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={authorUser.avatar} alt={authorUser.name} />
                  <AvatarFallback>{authorUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
        {isCsTyping && (
          <div className="flex items-end gap-3 justify-start">
             <Avatar className="h-8 w-8">
              <AvatarImage src={csUser.avatar} alt={csUser.name} />
              <AvatarFallback>{csUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-foreground/50 animate-pulse delay-0"></span>
                    <span className="h-2 w-2 rounded-full bg-foreground/50 animate-pulse delay-150"></span>
                    <span className="h-2 w-2 rounded-full bg-foreground/50 animate-pulse delay-300"></span>
                </div>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
}
