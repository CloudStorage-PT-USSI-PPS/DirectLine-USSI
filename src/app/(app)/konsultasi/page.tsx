
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { chatHistory, users } from '@/lib/data';
import type { ChatMessage, ChatCategory } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Info } from 'lucide-react';
import { ChatRoom } from '@/components/chat/chat-room';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function ConsultationWorkspace() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const sessionId = searchParams.get('session');

  const activeChat = sessionId ? chatHistory.find(c => c.id === sessionId) : null;
  // This state would eventually hold multiple active chats
  const [activeChats, setActiveChats] = useState(activeChat ? [activeChat] : []);

  const handleSendMessage = async (chatId: string, content: string, file?: File) => {
    if (!user) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: 'cs',
      content,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...(file && { file: { name: file.name, url: URL.createObjectURL(file) } }),
    };

    // Update the state for the specific chat
    setActiveChats(currentChats =>
      currentChats.map(chat =>
        chat.id === chatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat
      )
    );

    // Simulate client reply
    return new Promise<void>(resolve => {
        setTimeout(() => {
          const clientReply: ChatMessage = {
            id: `client-reply-${Date.now()}`,
            author: 'client',
            content: 'Baik, terima kasih atas responnya!',
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          };
    
          setActiveChats(currentChats =>
            currentChats.map(chat =>
              chat.id === chatId ? { ...chat, messages: [...chat.messages, clientReply] } : chat
            )
          );
          
          toast({
              title: "Pesan Baru",
              description: `Klien ${activeChat?.client.name} telah membalas.`,
          });
          resolve();
        }, 2000);
    });
  };

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
    <div className="flex flex-col gap-6 h-full">
       <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <MessageSquare className="h-7 w-7" />
            <h1>Ruang Konsultasi Aktif</h1>
        </div>
      {/* This will eventually be a tabbed or multi-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
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
              <Badge variant={
                  chat.category === 'Kritis' ? 'destructive' :
                  chat.category === 'Tinggi' ? 'default' : 'secondary'
                }>{chat.category}</Badge>
            </CardHeader>
            <ChatRoom
              messages={chat.messages}
              user={chat.client} // The "current user" from the client's perspective
              csUser={user} // The logged-in CS agent
              onSendMessage={(content, file) => handleSendMessage(chat.id, content, file)}
              category={chat.category as ChatCategory}
              onCategoryChange={() => {}} // Category is read-only here
              isCategoryDisabled={true}
            />
          </Card>
        ))}
         {/* Placeholder for more chat rooms */}
        {[...Array(3 - activeChats.length)].map((_, i) => (
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
  );
}


export default function KonsultasiPage() {
    return (
        <Suspense fallback={<div>Memuat sesi...</div>}>
            <ConsultationWorkspace />
        </Suspense>
    )
}
