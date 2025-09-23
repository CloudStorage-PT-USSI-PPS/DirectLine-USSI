
'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { chatHistory, users } from '@/lib/data';
import type { ChatMessage, ChatCategory, Chat } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Info, X } from 'lucide-react';
import { ChatRoom } from '@/components/chat/chat-room';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CloseConsultationModal } from '@/components/chat/close-consultation-modal';


const ACTIVE_SESSIONS_KEY = 'active-cs-sessions';
const MAX_ACTIVE_CHATS = 3;

function ConsultationWorkspace() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const newSessionId = searchParams.get('session');

  const [allConsultations, setAllConsultations] = useState<Chat[]>([]);
  const [activeChats, setActiveChats] = useState<Chat[]>([]);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [chatToClose, setChatToClose] = useState<string | null>(null);

  // Load all available chats from sessionStorage and history
  useEffect(() => {
    try {
        const newConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
        const combined = [...newConsultations, ...chatHistory];
        const uniqueConsultations = Array.from(new Set(combined.map(c => c.id)))
            .map(id => combined.find(c => c.id === id)!);
        setAllConsultations(uniqueConsultations);
    } catch (e) {
        console.error("Failed to load consultations from sessionStorage", e);
        setAllConsultations(chatHistory);
    }
  }, []);


  // Effect to manage active sessions
  useEffect(() => {
    if (allConsultations.length === 0) return;

    let activeSessionIds: string[] = [];
    try {
      activeSessionIds = JSON.parse(sessionStorage.getItem(ACTIVE_SESSIONS_KEY) || '[]');
    } catch (e) {
      console.error('Failed to parse active sessions', e);
      activeSessionIds = [];
    }

    // Add new session ID from URL if it exists and isn't already active
    if (newSessionId && !activeSessionIds.includes(newSessionId)) {
      if (activeSessionIds.length < MAX_ACTIVE_CHATS) {
        activeSessionIds.unshift(newSessionId); // Add to the beginning
      } else {
        toast({
            title: "Batas Maksimal Tercapai",
            description: `Anda hanya dapat menangani ${MAX_ACTIVE_CHATS} konsultasi sekaligus.`,
            variant: "destructive"
        })
      }
      // Clean the URL
      router.replace('/konsultasi');
    }
    
    // Filter chats based on active IDs
    const currentlyActiveChats = activeSessionIds
        .map(id => allConsultations.find(chat => chat.id === id))
        .filter((chat): chat is Chat => !!chat);

    setActiveChats(currentlyActiveChats);

    // Persist the updated list of IDs
    sessionStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(currentlyActiveChats.map(c => c.id)));

  }, [newSessionId, allConsultations, router, toast]);

  const handleSendMessage = async (chatId: string, content: string, file?: File) => {
    if (!user) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: 'cs',
      content,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...(file && { file: { name: file.name, url: URL.createObjectURL(file) } }),
    };
    
    const updatedChats = activeChats.map(chat =>
      chat.id === chatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat
    );
    setActiveChats(updatedChats);

    // Simulate client reply
    return new Promise<void>(resolve => {
        setTimeout(() => {
          const clientReply: ChatMessage = {
            id: `client-reply-${Date.now()}`,
            author: 'client',
            content: 'Baik, terima kasih atas responnya!',
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          };
          
          const finalChats = updatedChats.map(chat =>
            chat.id === chatId ? { ...chat, messages: [...chat.messages, clientReply] } : chat
          );
          setActiveChats(finalChats);
          
          const activeChat = finalChats.find(c => c.id === chatId);
          toast({
              title: "Pesan Baru",
              description: `Klien ${activeChat?.client.name} telah membalas.`,
          });
          resolve();
        }, 2000);
    });
  };

    const handleCategoryChange = (chatId: string, newCategory: ChatCategory) => {
        const updatedChats = activeChats.map(chat =>
            chat.id === chatId ? { ...chat, category: newCategory } : chat
        );
        setActiveChats(updatedChats);

        try {
            const existingChats: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
            const updatedStorageChats = existingChats.map(chat => 
                chat.id === chatId ? { ...chat, category: newCategory } : chat
            );
            sessionStorage.setItem('new-consultations', JSON.stringify(updatedStorageChats));
        } catch (e) {
            console.error("Failed to update consultation in sessionStorage", e);
        }
        const changedChat = activeChats.find(c => c.id === chatId);
        if (changedChat) {
             toast({
                title: "Kategori Diperbarui",
                description: `Prioritas untuk chat dengan ${changedChat.client.name} diubah menjadi "${newCategory}".`
            });
        }
    };

    const handleCloseChat = (chatId: string) => {
        setChatToClose(chatId);
        setShowCloseModal(true);
    }
    
    const confirmCloseChat = (reason: string) => {
        if (!chatToClose) return;

        console.log(`Chat ${chatToClose} ditutup dengan alasan: ${reason}`);

        const updatedChats = activeChats.filter(chat => chat.id !== chatToClose);
        setActiveChats(updatedChats);

        const updatedIds = updatedChats.map(chat => chat.id);
        sessionStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(updatedIds));

        const closedChat = activeChats.find(c => c.id === chatToClose);
        toast({
            title: "Sesi Ditutup",
            description: `Anda telah menutup sesi dengan ${closedChat?.client.name}.`
        });

        // Reset modal state
        setShowCloseModal(false);
        setChatToClose(null);
    }


  if (!user || user.role !== 'cs') {
    return (
        <div className="flex h-full items-center justify-center">
            <p>Hanya bisa diakses oleh Customer Support.</p>
        </div>
    );
  }

  if (activeChats.length === 0) {
    return (
        <div className="flex flex-col h-full items-center justify-center text-center gap-4 p-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Ruang Konsultasi CS</h2>
            <p className="text-muted-foreground max-w-md">
                Tidak ada sesi konsultasi aktif. Silakan pilih permintaan dari halaman{" "}
                <a href="/dashboard" className="text-primary underline">Dashboard</a> untuk memulai.
            </p>
        </div>
    );
  }

  return (
    <>
        <div className="flex flex-col gap-6 h-full">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                <MessageSquare className="h-7 w-7" />
                <h1>Ruang Konsultasi Aktif</h1>
            </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
            {activeChats.map(chat => (
            <Card key={chat.id} className="flex flex-col rounded-2xl shadow-md">
                <CardHeader className="flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={chat.client.avatar} alt={chat.client.name} />
                            <AvatarFallback>{chat.client.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base">{chat.client.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{chat.client.email}</p>
                        </div>
                    </div>
                <div className="flex items-center gap-2">
                    <Badge variant={
                        chat.category === 'Kritis' ? 'destructive' :
                        chat.category === 'Tinggi' ? 'default' : 'secondary'
                    }>{chat.category}</Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCloseChat(chat.id)}>
                        <X className="h-4 w-4"/>
                        <span className="sr-only">Tutup Sesi</span>
                    </Button>
                </div>
                </CardHeader>
                <ChatRoom
                messages={chat.messages}
                user={chat.client} 
                csUser={user} 
                onSendMessage={(content, file) => handleSendMessage(chat.id, content, file)}
                category={chat.category as ChatCategory}
                onCategoryChange={(newCategory) => handleCategoryChange(chat.id, newCategory)}
                isCategoryDisabled={false}
                />
            </Card>
            ))}
            {/* Placeholder for more chat rooms */}
            {[...Array(Math.max(0, MAX_ACTIVE_CHATS - activeChats.length))].map((_, i) => (
                <Card key={`placeholder-${i}`} className="rounded-2xl shadow-md flex items-center justify-center bg-muted/50">
                    <div className="text-center text-muted-foreground p-8">
                        <Info className="mx-auto h-8 w-8 mb-4"/>
                        <p className="font-semibold">Slot Konsultasi Kosong</p>
                        <p className="text-sm">Pilih klien dari dashboard untuk memulai.</p>
                    </div>
                </Card>
            ))}
        </div>
        </div>
        <CloseConsultationModal
            isOpen={showCloseModal}
            onClose={() => {
                setShowCloseModal(false);
                setChatToClose(null);
            }}
            onSubmit={confirmCloseChat}
        />
    </>
  );
}


export default function KonsultasiPage() {
    return (
        <Suspense fallback={<div>Memuat sesi...</div>}>
            <ConsultationWorkspace />
        </Suspense>
    )
}

    

    

    