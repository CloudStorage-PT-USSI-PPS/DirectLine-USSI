
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import type { Chat, ChatMessage, User } from '@/lib/types';
import { chatHistory, users } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MessageSquare, ServerCrash, X } from 'lucide-react';
import { ChatRoom } from '@/components/chat/chat-room';
import { useToast } from '@/hooks/use-toast';
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
      setActiveChats(chatsToDisplay);
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
            <Card key={chat.id} className="flex flex-col rounded-2xl shadow-md overflow-hidden h-[70vh]">
              <CardHeader className="flex-row items-center justify-between">
                <div className='grid gap-1.5'>
                    <CardTitle className="text-base">{chat.client.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openCloseModal(chat.id)}>
                    <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <ChatRoom
                messages={chat.messages}
                user={users.cs} 
                csUser={chat.cs || users.cs}
                onSendMessage={(content, file) => handleSendMessage(chat.id, content, file)}
                category={chat.category}
                onCategoryChange={() => {}} // Not changeable by CS
                isCategoryDisabled={true}
              />
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center rounded-2xl shadow-md p-8 min-h-[400px]">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Tidak Ada Konsultasi Aktif</h2>
            <p className="text-muted-foreground mt-2">Menunggu permintaan konsultasi baru dari klien.</p>
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
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCloseModalOpen, setCloseModalOpen] = useState(false);

    useEffect(() => {
        const sessionId = searchParams.get('session');
        if (!sessionId) {
            setIsLoading(false);
            return;
        }

        try {
            const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
            const combinedChats = [...allConsultations, ...chatHistory];
            const chat = combinedChats.find(c => c.id === sessionId);

            if (chat) {
                setSelectedChat(chat);

                const activeCsSessions: string[] = JSON.parse(sessionStorage.getItem('active-cs-sessions') || '[]');
                if (!activeCsSessions.includes(sessionId)) {
                    activeCsSessions.push(sessionId);
                    sessionStorage.setItem('active-cs-sessions', JSON.stringify(activeCsSessions));
                }

            } else {
                setError('Sesi konsultasi tidak ditemukan.');
            }
        } catch (e) {
            console.error("Failed to load session:", e);
            setError('Gagal memuat sesi konsultasi.');
        } finally {
            setIsLoading(false);
        }
    }, [searchParams]);

    const handleSendMessage = async (content: string, file?: File) => {
        if (!user || !selectedChat) return;

        const csUser = Object.values(users).find(u => u.role === 'cs')!;

        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            author: 'cs',
            content,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            ...(file && { file: { name: file.name, url: URL.createObjectURL(file) } }),
        };

        setSelectedChat(prev => {
            if (!prev) return null;
            const updatedChat = { ...prev, messages: [...prev.messages, newMessage] };

            try {
                const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
                const chatIndex = allConsultations.findIndex(c => c.id === selectedChat.id);
                if (chatIndex > -1) {
                    allConsultations[chatIndex] = updatedChat;
                    sessionStorage.setItem('new-consultations', JSON.stringify(allConsultations));
                }
            } catch (e) {
                console.error("Failed to update sessionStorage", e);
            }

            return updatedChat;
        });
        
        toast({
            title: "Pesan Terkirim",
            description: `Pesan Anda untuk ${selectedChat.client.name} telah terkirim.`,
        });
    };

    const handleCloseSubmit = (reason: string) => {
        console.log("Closing consultation:", reason);
        toast({
            title: "Sesi Ditutup",
            description: "Sesi konsultasi telah ditutup."
        });
        setCloseModalOpen(false);
        // Here you would redirect or update UI to show chat is closed
    };


    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Memuat sesi...</p>
            </div>
        );
    }
    
    // If no session ID in URL, show the multi-chat workspace
    if (!searchParams.get('session')) {
        return <ConsultationWorkspace />;
    }

    if (error) {
        return (
            <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
                <Card className="max-w-lg p-8 rounded-2xl shadow-md">
                     <ServerCrash className="mx-auto h-12 w-12 text-destructive mb-4" />
                     <h1 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h1>
                     <p className="text-muted-foreground">{error}</p>
                </Card>
            </div>
        );
    }

    if (!selectedChat) {
         return (
            <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Mempersiapkan ruang konsultasi...</p>
            </div>
        );
    }
    
    // If session ID is present, show the single chat room view
    return (
        <div className="flex h-[calc(100vh-8rem-2rem)] flex-col items-center">
            <div className="w-full max-w-4xl flex h-full flex-col">
                <Card className="flex flex-1 flex-col rounded-2xl shadow-md overflow-hidden">
                     <CardHeader className="flex-row items-center justify-between">
                        <div>
                             <CardTitle>Konsultasi dengan {selectedChat.client.name}</CardTitle>
                        </div>
                        <Button variant="destructive" onClick={() => setCloseModalOpen(true)}>Tutup Sesi</Button>
                     </CardHeader>
                    <ChatRoom
                        messages={selectedChat.messages}
                        user={user!}
                        csUser={selectedChat.cs || users.cs}
                        onSendMessage={handleSendMessage}
                        category={selectedChat.category}
                        onCategoryChange={() => {}}
                        isCategoryDisabled={true}
                    />
                </Card>
            </div>
             <CloseConsultationModal
                isOpen={isCloseModalOpen}
                onClose={() => setCloseModalOpen(false)}
                onSubmit={handleCloseSubmit}
            />
        </div>
    );
}

