
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Chat, ChatMessage, ChatCategory } from '@/lib/types';
import { chatHistory, users } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, X } from 'lucide-react';
import { ChatRoom } from '@/components/chat/chat-room';
import { Button } from '@/components/ui/button';
import { CloseConsultationModal } from '@/components/chat/close-consultation-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function ConsultationWorkspace() {
  const searchParams = useSearchParams();
  const [activeChats, setActiveChats] = useState<Chat[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [closingChatId, setClosingChatId] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session');
    let currentActiveSessions: string[] = [];
    try {
      currentActiveSessions = JSON.parse(sessionStorage.getItem('active-cs-sessions') || '[]');
      if (sessionId && !currentActiveSessions.includes(sessionId)) {
        currentActiveSessions.push(sessionId);
        sessionStorage.setItem('active-cs-sessions', JSON.stringify(currentActiveSessions));
      }
    } catch(e) {
      console.error("Failed to update active sessions", e);
    }

    try {
      const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
      const combinedChats = [...allConsultations, ...chatHistory];
      
      const uniqueChatMap = new Map<string, Chat>();
      combinedChats.forEach(chat => {
        if (!uniqueChatMap.has(chat.id)) {
          uniqueChatMap.set(chat.id, chat);
        }
      });

      const sessionsToLoad = currentActiveSessions.length > 0 ? currentActiveSessions : chatHistory.slice(0, 3).map(c => c.id);

      const chatsToDisplay = sessionsToLoad
        .map(id => uniqueChatMap.get(id))
        .filter((chat): chat is Chat => chat !== undefined);
      
      setActiveChats(chatsToDisplay);
    } catch (e) {
      console.error("Failed to load chats", e);
      const chatFromHistory = chatHistory.find(c => c.id === sessionId);
      if(chatFromHistory) {
        setActiveChats([chatFromHistory]);
      } else {
        setActiveChats(chatHistory.slice(0, 3));
      }
    }
  }, [searchParams]);

  const handleSendMessage = async (chatId: string, content: string, file?: File) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: 'cs',
      content,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...(file && { file: { name: file.name, url: URL.createObjectURL(file) } }),
    };

    setActiveChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const updatedChat = { ...chat, messages: [...chat.messages, newMessage] };
        try {
          const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
          const chatIndex = allConsultations.findIndex(c => c.id === chatId);
          if (chatIndex > -1) {
            allConsultations[chatIndex] = updatedChat;
            sessionStorage.setItem('new-consultations', JSON.stringify(allConsultations));
          }
        } catch (e) {
          console.error("Failed to update sessionStorage", e);
        }
        return updatedChat;
      }
      return chat;
    }));
  };
  
  const handleCategoryChange = (chatId: string, newCategory: ChatCategory) => {
    setActiveChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === chatId) {
          const updatedChat = { ...chat, category: newCategory };
          try {
            const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
            const chatIndex = allConsultations.findIndex(c => c.id === chatId);
            if (chatIndex > -1) {
              allConsultations[chatIndex] = updatedChat;
              sessionStorage.setItem('new-consultations', JSON.stringify(allConsultations));
            }
          } catch (e) {
            console.error("Failed to update sessionStorage for category change", e);
          }
          return updatedChat;
        }
        return chat;
      })
    );
  };

  const openCloseModal = (chatId: string) => {
    setClosingChatId(chatId);
    setIsModalOpen(true);
  };

  const handleCloseConsultation = (reason: string) => {
    if (closingChatId) {
      setActiveChats(prev => prev.filter(c => c.id !== closingChatId));

      try {
        const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
        const updatedConsultations = allConsultations.filter(c => c.id !== closingChatId);
        sessionStorage.setItem('new-consultations', JSON.stringify(updatedConsultations));

        const activeCsSessions: string[] = JSON.parse(sessionStorage.getItem('active-cs-sessions') || '[]');
        const updatedActiveSessions = activeCsSessions.filter(id => id !== closingChatId);
        sessionStorage.setItem('active-cs-sessions', JSON.stringify(updatedActiveSessions));
      } catch (e) {
        console.error("Failed to update sessionStorage on close", e);
      }
    }
    setIsModalOpen(false);
    setClosingChatId(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <MessageSquare className="h-6 w-6" />
          <h1>Ruang Konsultasi CS</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Dashboard
          </Button>
          <Button variant="ghost" size="sm">
            Konsultasi
          </Button>
          <Button variant="ghost" size="sm">
            Riwayat
          </Button>
          <div className="relative">
            <img src="/path/to/profile-image.jpg" alt="Profile" className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex-1 flex gap-6 pb-4 overflow-x-auto">
        {activeChats.length > 0 ? (
          <>
            {activeChats.map(chat => (
              <div key={chat.id} className="flex-shrink-0 w-full max-w-sm flex flex-col">
                <Card className="flex flex-1 flex-col rounded-2xl shadow-md overflow-hidden">
                  <CardHeader className="flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 border-b">
                    <div className='flex items-center gap-2'>
                      <img src="/path/to/user-avatar.jpg" alt="User Avatar" className="h-8 w-8 rounded-full" />
                      <CardTitle className="text-base font-semibold">{chat.client.name}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openCloseModal(chat.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0">
                    <ChatRoom
                      messages={chat.messages}
                      user={users.cs}
                      csUser={chat.cs || users.cs}
                      onSendMessage={(content, file) => handleSendMessage(chat.id, content, file)}
                      category={chat.category}
                      onCategoryChange={(newCategory) => handleCategoryChange(chat.id, newCategory)}
                      isCategoryDisabled={false}
                    />
                  </CardContent>
                </Card>
              </div>
            ))}
            <div className="flex-shrink-0 w-full max-w-sm flex flex-col">
              <Card className="flex flex-1 flex-col rounded-2xl shadow-md overflow-hidden">
                <CardHeader className="flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 border-b">
                  <div className='grid gap-1.5'>
                    <CardTitle className="text-base">Kolom Lain</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-4">
                  {/* Isi untuk kolom lain, seperti daftar chat yang belum diambil */}
                  <div className="space-y-2">
                    <div className="p-2 border rounded-md">
                      <p className="font-medium">Konsultasi Baru 1</p>
                      <p className="text-sm text-gray-500">Dari: User A</p>
                    </div>
                    <div className="p-2 border rounded-md">
                      <p className="font-medium">Konsultasi Baru 2</p>
                      <p className="text-sm text-gray-500">Dari: User B</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card className="flex flex-col items-center justify-center rounded-2xl shadow-md p-8 flex-1">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Tidak Ada Konsultasi Aktif</h2>
            <p className="text-muted-foreground mt-2">Pilih sesi dari halaman dashboard untuk memulai.</p>
          </Card>
        )}
      </div>
      <CloseConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCloseConsultation}
      />
    </div>
  );
}

export default function CsWorkspacePage() {
  return <ConsultationWorkspace />;
}
