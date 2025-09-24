
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { Chat, ChatMessage } from '@/lib/types';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Loader2, MessageSquare, Plus, X } from 'lucide-react';
import { ChatRoom } from '@/components/chat/chat-room';
import { users, chatHistory } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CloseConsultationModal } from '@/components/chat/close-consultation-modal';

export default function CSWorkspacePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeConsultations, setActiveConsultations] = useState<Chat[]>(chatHistory.slice(0, 3));
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [selectedChatToClose, setSelectedChatToClose] = useState<string | null>(null);

  const handleSendMessage = async (chatId: string, content: string, file?: File) => {
    if (!user) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: 'cs',
      content,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...(file && { file: { name: file.name, url: URL.createObjectURL(file) } }),
    };

    setActiveConsultations(prev => 
        prev.map(chat => 
            chat.id === chatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat
        )
    );

    toast({
      title: "Pesan Terkirim",
      description: `Pesan Anda untuk klien ${activeConsultations.find(c => c.id === chatId)?.client.name} telah dikirim.`,
    });

    // Simulate client reply
    return new Promise<void>(resolve => {
        setTimeout(() => {
            const clientReply: ChatMessage = {
                id: `client-reply-${Date.now()}`,
                author: 'client',
                content: 'Oke, terima kasih atas informasinya. Akan saya coba.',
                timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            };
            setActiveConsultations(prev => 
                prev.map(chat => 
                    chat.id === chatId ? { ...chat, messages: [...chat.messages, clientReply] } : chat
                )
            );
            resolve();
        }, 2000);
    });
  };

  const handleOpenCloseModal = (chatId: string) => {
    setSelectedChatToClose(chatId);
    setIsCloseModalOpen(true);
  };

  const handleCloseConsultation = (reason: string) => {
    if (!selectedChatToClose) return;
    
    console.log(`Closing chat ${selectedChatToClose} with reason: ${reason}`);

    setActiveConsultations(prev => prev.filter(chat => chat.id !== selectedChatToClose));

    toast({
        title: 'Sesi Ditutup',
        description: 'Sesi konsultasi telah berhasil ditutup.',
    });
    
    setIsCloseModalOpen(false);
    setSelectedChatToClose(null);
  };

  if (!user || user.role !== 'cs') {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-4">Memuat...</p>
      </div>
    );
  }

  return (
    <>
        <div className="flex flex-col gap-6 md:gap-8">
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Ruang Kerja Konsultasi</h1>
                <p className="text-muted-foreground">
                    Kelola beberapa sesi konsultasi dengan klien secara bersamaan.
                </p>
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 lg:items-start">
                {activeConsultations.map((chat) => (
                    <Card key={chat.id} className="flex flex-col rounded-2xl shadow-md overflow-hidden">
                        <CardHeader className="flex-row items-center justify-between p-4 border-b">
                            <div className='grid gap-1'>
                                <CardTitle className="text-base font-semibold">{chat.client.name}</CardTitle>
                                <CardDescription className="text-xs">{chat.client.bprName}</CardDescription>
                            </div>
                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenCloseModal(chat.id)}>
                                <X className="h-4 w-4" />
                                <span className="sr-only">Tutup Sesi</span>
                            </Button>
                        </CardHeader>
                        <div className="flex-1 flex flex-col h-[60vh]">
                            <ChatRoom
                                messages={chat.messages}
                                user={user}
                                csUser={chat.cs || users.cs}
                                onSendMessage={(content, file) => handleSendMessage(chat.id, content, file)}
                                category={chat.category}
                                onCategoryChange={() => {}}
                                isCategoryDisabled={true}
                            />
                        </div>
                    </Card>
                ))}
                 <Card className="rounded-2xl shadow-md border-dashed h-full flex items-center justify-center">
                    <div className="text-center p-8">
                        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Slot Kosong</h3>
                        <p className="text-sm text-muted-foreground mb-4">Anda bisa menerima permintaan konsultasi baru.</p>
                        <Button variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Cari Sesi Baru
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
        <CloseConsultationModal 
            isOpen={isCloseModalOpen}
            onClose={() => setIsCloseModalOpen(false)}
            onSubmit={handleCloseConsultation}
        />
    </>
  );
}
