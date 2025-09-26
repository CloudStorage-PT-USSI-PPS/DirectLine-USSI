
'use client';

import { useState } from 'react';
import type { ChatCategory, ChatMessage, User } from '@/lib/types';
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
    // CS doesn't need a typing indicator for their own messages
    if (user.role !== 'cs') {
      setIsCsTyping(true);
    }
    await onSendMessage(content, file);
    if (user.role !== 'cs') {
      setIsCsTyping(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
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
    </div>
  );
}

    