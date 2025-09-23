
'use client';

import { useState } from 'react';
import type { ChatCategory, ChatMessage, User } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { ChatBox } from '@/components/chat/chat-box';
import { MessageInput } from '@/components/chat/message-input';

interface ChatRoomProps {
  messages: ChatMessage[];
  user: User;
  csUser: User;
  onSendMessage: (content: string, file?: File) => Promise<void>;
  category: ChatCategory;
  onCategoryChange: (category: ChatCategory) => void;
  isCategoryDisabled?: boolean;
}

export function ChatRoom({
  messages,
  user,
  csUser,
  onSendMessage,
  category,
  onCategoryChange,
  isCategoryDisabled,
}: ChatRoomProps) {
  const [isCsTyping, setIsCsTyping] = useState(false);

  const handleSendMessage = async (content: string, file?: File) => {
    setIsCsTyping(true);
    await onSendMessage(content, file);
    setIsCsTyping(false);
  };

  return (
    <Card className="flex flex-1 flex-col rounded-2xl shadow-md h-full">
      <ChatBox
        messages={messages}
        currentUser={user}
        csUser={csUser}
        isCsTyping={isCsTyping}
      />
      <MessageInput
        onSendMessage={handleSendMessage}
        category={category}
        onCategoryChange={onCategoryChange}
        isCategoryDisabled={isCategoryDisabled}
      />
    </Card>
  );
}
