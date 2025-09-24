
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { Chat, ChatMessage, User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MessageSquare, ServerCrash } from 'lucide-react';
import { ChatRoom } from '@/components/chat/chat-room';
import { users } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useChatSession } from '@/components/providers/chat-session-provider';

export default function ClientConsultationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addMessage: addMessageToGlobal, setMessages: setGlobalMessages } = useChatSession();
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCsActive, setIsCsActive] = useState(false);

  useEffect(() => {
    if (!user) return;

    try {
      const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
      const activeCsSessionIds: string[] = JSON.parse(sessionStorage.getItem('active-cs-sessions') || '[]');
      
      const clientSession = allConsultations.find(chat => chat.client.id === user.id);

      if (clientSession) {
        setActiveChat(clientSession);
        setLocalMessages(clientSession.messages);
        
        if (activeCsSessionIds.includes(clientSession.id)) {
          setIsCsActive(true); // CS has responded, show chat room
        } else {
          setIsCsActive(false); // Waiting for CS
        }
      } else {
        // No session started by this client
        setActiveChat(null);
      }
    } catch (e) {
      console.error("Failed to load consultation from sessionStorage", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleSendMessage = async (content: string, file?: File) => {
    if (!user || !activeChat) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: 'client',
      content,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...(file && { file: { name: file.name, url: URL.createObjectURL(file) } }),
    };

    const updatedMessages = [...localMessages, newMessage];
    setLocalMessages(updatedMessages);
    addMessageToGlobal(newMessage); // Also update global context if needed

    // Simulate CS reply
    setTimeout(() => {
      const csReply: ChatMessage = {
        id: `cs-reply-${Date.now()}`,
        author: 'cs',
        content: 'Baik, pesan Anda sudah kami terima. Mohon tunggu balasan dari kami selanjutnya.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setLocalMessages(prev => [...prev, csReply]);
      addMessageToGlobal(csReply);
      toast({
        title: "Pesan Baru",
        description: `Customer Support telah membalas.`,
      });
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Memuat sesi konsultasi Anda...</p>
      </div>
    );
  }

  if (!activeChat) {
    return (
       <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
          <Card className="max-w-lg p-8 rounded-2xl shadow-md">
                <MessageSquare className="mx-auto h-12 w-12 text-primary mb-4" />
                <h1 className="text-2xl font-bold mb-2">Belum Ada Konsultasi</h1>
                <p className="text-muted-foreground">
                    Anda belum memulai sesi konsultasi apapun. Silakan pergi ke halaman 'Chat' untuk memulai percakapan baru.
                </p>
          </Card>
      </div>
    );
  }

  if (!isCsActive) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
          <Card className="max-w-lg p-8 rounded-2xl shadow-md">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-bold mb-2">Menunggu Tanggapan</h1>
            <p className="text-muted-foreground">
                Permintaan konsultasi Anda telah kami terima dan sedang dalam antrian. Mohon tunggu sebentar, tim Customer Support PT USSI akan segera menghubungi Anda.
            </p>
          </Card>
      </div>
    );
  }

  // CS is active, show the chat room
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center">
        <div className="w-full max-w-4xl flex h-full flex-col">
            <Card className="flex flex-1 flex-col rounded-2xl shadow-md overflow-hidden">
                <ChatRoom
                    messages={localMessages}
                    user={user!}
                    csUser={activeChat.cs || users.cs}
                    onSendMessage={handleSendMessage}
                    category={activeChat.category}
                    onCategoryChange={() => {}} // Category is fixed
                    isCategoryDisabled={true}
                />
            </Card>
        </div>
    </div>
  );
}
