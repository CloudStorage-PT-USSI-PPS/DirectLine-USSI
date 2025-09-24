
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import type { Chat, ChatMessage, User, ChatCategory } from '@/lib/types';
import { chatHistory, users } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, X } from 'lucide-react';
import { ChatRoom } from '@/components/chat/chat-room';
import { Button } from '@/components/ui/button';
import { CloseConsultationModal } from '@/components/chat/close-consultation-modal';

function ConsultationWorkspace() {
  const [activeChats, setActiveChats] = useState<Chat[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [closingChatId, setClosingChatId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
      const chatsToDisplay = allConsultations.length > 0 ? allConsultations : chatHistory.slice(0, 3);
      
      const activeCsSessions: string[] = JSON.parse(sessionStorage.getItem('active-cs-sessions') || '[]');
      const sessionsToDisplay = chatsToDisplay.filter(c => activeCsSessions.includes(c.id));
      
      if (sessionsToDisplay.length > 0) {
        setActiveChats(sessionsToDisplay);
      } else {
         // Fallback to showing first 3 if no active sessions are marked
        setActiveChats(allConsultations.length > 0 ? allConsultations.slice(0, 3) : chatHistory.slice(0, 3));
      }

    } catch (error) {
      console.error("Failed to load chats from sessionStorage, using fallback.", error);
      setActiveChats(chatHistory.slice(0, 3));
    }
  }, []);

  const handleSendMessage = async (chatId: string, content: string, file?: File) => {
    // In a real app, you would send this to your backend
    console.log(`CS sending message to ${chatId}:`, { content, file });

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
          // Update sessionStorage as well
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
      console.log(`Closing chat ${closingChatId}. Reason: ${reason}`);
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-center gap-2 text-2xl font-bold tracking-tight">
        <MessageSquare className="h-6 w-6" />
        <h1>Ruang Konsultasi CS</h1>
      </div>
      {activeChats.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeChats.map(chat => (
            <Card key={chat.id} className="flex flex-col rounded-2xl shadow-md overflow-hidden h-[75vh]">
              <CardHeader className="flex-row items-center justify-between">
                <div className='grid gap-1.5'>
                    <CardTitle className="text-base">{chat.client.name}</CardTitle>
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
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center rounded-2xl shadow-md p-8 min-h-[400px]">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Tidak Ada Konsultasi Aktif</h2>
            <p className="text-muted-foreground mt-2">Pilih sesi dari halaman dashboard untuk memulai.</p>
        </Card>
      )}
       <CloseConsultationModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCloseConsultation}
        />
    </div>
  );
}


export default function CsWorkspacePage() {
    const searchParams = useSearchParams();
    const [activeChats, setActiveChats] = useState<Chat[]>([]);
    
    // This effect will run once to load all chats that the CS has opened.
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

            const chatsToDisplay = currentActiveSessions
                .map(id => uniqueChatMap.get(id))
                .filter((chat): chat is Chat => chat !== undefined);
            
            setActiveChats(chatsToDisplay);
        } catch (e) {
            console.error("Failed to load chats", e);
            // Fallback if sessionStorage fails
            const chatFromHistory = chatHistory.find(c => c.id === sessionId);
            if(chatFromHistory) setActiveChats([chatFromHistory]);
        }

    }, [searchParams]);


    if (!searchParams.get('session') && activeChats.length === 0) {
       return <ConsultationWorkspace />;
    }
    
    // The main component is now always the multi-chat workspace
    return <ConsultationWorkspace />;
}

