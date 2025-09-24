
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { Chat, ChatMessage } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MessageSquare } from 'lucide-react';
import { ChatRoom } from '@/components/chat/chat-room';
import { users } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function ClientConsultationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResponded, setIsResponded] = useState(false);

  useEffect(() => {
    if (!user) return;

    try {
      const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
      const activeCsSessionIds: string[] = JSON.parse(sessionStorage.getItem('active-cs-sessions') || '[]');
      
      const clientChat = allConsultations.find(chat => chat.client.id === user.id);

      if (clientChat) {
        setActiveChat(clientChat);
        // Check if a CS has responded by seeing if the chat ID is in the active CS sessions
        if (activeCsSessionIds.includes(clientChat.id)) {
          setIsResponded(true);
        } else {
          setIsResponded(false);
        }
      } else {
        // No chat initiated by this client found
        setActiveChat(null);
      }
    } catch (error) {
      console.error("Failed to load consultation status from sessionStorage", error);
      toast({
        title: "Gagal Memuat Sesi",
        description: "Tidak dapat mengambil status konsultasi Anda.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const handleSendMessage = async (content: string, file?: File) => {
    if (!user || !activeChat) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: 'client',
      content,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...(file && { file: { name: file.name, url: URL.createObjectURL(file) } }),
    };

    const updatedChat = { ...activeChat, messages: [...activeChat.messages, newMessage] };
    setActiveChat(updatedChat);

    // Simulate CS reply
    return new Promise<void>(resolve => {
      setTimeout(() => {
        const csReply: ChatMessage = {
          id: `cs-reply-${Date.now()}`,
          author: 'cs',
          content: 'Terima kasih, pesan Anda sudah kami terima dan akan segera kami proses.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        
        setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, csReply] } : null);
        
        toast({
          title: "Pesan Baru",
          description: `Customer Support telah membalas.`,
        });
        resolve();
      }, 1500);
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!activeChat) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
        <Card className="max-w-lg p-8 rounded-2xl shadow-md">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Belum Ada Konsultasi</h1>
            <p className="text-muted-foreground">
              Anda belum memulai sesi konsultasi apapun. Silakan pergi ke halaman 'Chat' untuk memulai percakapan baru.
            </p>
        </Card>
      </div>
    );
  }

  if (isResponded) {
    return (
      <div className="flex h-[calc(100vh-8rem-2rem)] flex-col items-center">
        <div className="w-full max-w-4xl flex h-full flex-col space-y-4">
             <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center">Ruang Konsultasi</h1>
            <Card className="flex flex-1 flex-col rounded-2xl shadow-md overflow-hidden">
            <ChatRoom
              messages={activeChat.messages}
              user={user!}
              csUser={activeChat.cs || users.cs}
              onSendMessage={handleSendMessage}
              category={activeChat.category}
              onCategoryChange={() => {}} // Category is set by client initially, cannot be changed here.
              isCategoryDisabled={true}
            />
            </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
        <Card className="max-w-lg p-8 rounded-2xl shadow-md animate-pulse">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Menunggu Tanggapan</h1>
            <p className="text-muted-foreground">
                Permintaan konsultasi Anda telah kami terima dan sedang dalam antrian. Mohon tunggu sebentar, tim Customer Support PT USSI akan segera menghubungi Anda.
            </p>
        </Card>
    </div>
  );
}
