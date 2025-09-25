
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { Chat, ChatMessage, User } from '@/lib/types';
import { users, chatHistory } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MessageSquare, Clock, ServerCrash } from 'lucide-react';
import { ChatRoom } from '@/components/chat/chat-room';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function ClientConsultationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  // Simulate an active chat by default for demonstration
  const [activeChat, setActiveChat] = useState<Chat | null>(chatHistory[0]); 
  const [isLoading, setIsLoading] = useState(false); // Set to false to show chat immediately
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // The previous logic for finding active chat is commented out for demo purposes
    /*
    if (!user) return;
    setIsLoading(true);
    try {
      const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
      const activeCsSessionIds: string[] = JSON.parse(sessionStorage.getItem('active-cs-sessions') || '[]');

      const clientActiveSession = allConsultations.find(chat =>
        chat.client.id === user.id && activeCsSessionIds.includes(chat.id)
      );

      setActiveChat(clientActiveSession || null);

    } catch (e) {
      console.error("Failed to check for active sessions", e);
      setError("Gagal memuat sesi aktif Anda. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
    */
     // For demo, we just ensure a chat is loaded.
     if (!activeChat) {
        setActiveChat(chatHistory[0]);
     }
  }, [user, activeChat]);

  const handleSendMessage = async (content: string, file?: File) => {
    if (!user || !activeChat) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: 'client',
      content,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...(file && { file: { name: file.name, url: URL.createObjectURL(file) } }),
    };

    // Simulate updating the chat
    setActiveChat(prev => {
        if (!prev) return null;
        const updatedChat = { ...prev, messages: [...prev.messages, newMessage] };
         try {
            const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
            const chatIndex = allConsultations.findIndex(c => c.id === activeChat.id);
            if (chatIndex > -1) {
                allConsultations[chatIndex] = updatedChat;
                sessionStorage.setItem('new-consultations', JSON.stringify(allConsultations));
            }
        } catch (e) {
            console.error("Failed to update sessionStorage", e);
        }
        return updatedChat;
    });

     // Simulate CS reply
    setTimeout(() => {
        const csReply: ChatMessage = {
          id: `cs-msg-${Date.now()}`,
          author: 'cs',
          content: 'Terima kasih, pesan Anda sudah kami terima.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        setActiveChat(prev => {
            if (!prev) return null;
            const updatedChat = { ...prev, messages: [...prev.messages, csReply] };
            // Update sessionStorage again with CS reply
             try {
                const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
                const chatIndex = allConsultations.findIndex(c => c.id === activeChat.id);
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
          title: "Pesan Baru",
          description: `Customer Support telah membalas.`,
        });
    }, 1500);

  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Mencari sesi aktif...</p>
      </div>
    );
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

  if (!activeChat) {
    return (
       <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
            <Card className="max-w-lg p-8 rounded-2xl shadow-md">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Belum Ada Konsultasi Aktif</h1>
                <p className="text-muted-foreground mb-6">
                   Anda belum memiliki sesi konsultasi yang sedang ditanggapi oleh CS.
                </p>
                <Button onClick={() => router.push('/chat')}>Mulai Konsultasi Baru</Button>
            </Card>
        </div>
    );
  }

  if (!user) {
    return (
       <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Memuat data pengguna...</p>
      </div>
    )
  }

  return (
     <div className="flex h-[calc(100vh-8rem-2rem)] flex-col items-center">
        <div className="w-full max-w-4xl flex h-full flex-col">
            <Card className="flex flex-1 flex-col rounded-2xl shadow-md overflow-hidden">
                <ChatRoom
                    messages={activeChat.messages}
                    user={user}
                    csUser={activeChat.cs || users.cs}
                    onSendMessage={handleSendMessage}
                    category={activeChat.category}
                    onCategoryChange={() => {}}
                    isCategoryDisabled={true}
                />
            </Card>
        </div>
    </div>
  );
}

export default ClientConsultationPage;
