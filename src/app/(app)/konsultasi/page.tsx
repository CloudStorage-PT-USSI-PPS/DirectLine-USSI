
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { Chat, ChatMessage, User } from '@/lib/types';
import { users, chatHistory } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MessageSquare, Clock, ServerCrash, LogOut, CircleCheck } from 'lucide-react';
import { ChatRoom } from '@/components/chat/chat-room';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FeedbackModal } from '@/components/chat/feedback-modal';

function ClientConsultationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  // Simulate an active chat by default for demonstration
  const [activeChat, setActiveChat] = useState<Chat | null>(null); 
  const [isLoading, setIsLoading] = useState(true); // Set to true initially
  const [error, setError] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);


  useEffect(() => {
    setIsLoading(true);
    if (!user) return;

    // Simulate that a CS agent has accepted a chat.
    // In a real app, this would come from a websocket or API call.
    try {
        const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
        
        // Find the most recent consultation for this user that isn't yet in active-cs-sessions
        let clientActiveSession = allConsultations.find(chat => chat.client.id === user.id);

        if (clientActiveSession) {
            // This simulates the CS accepting the chat.
            let activeCsSessionIds: string[] = JSON.parse(sessionStorage.getItem('active-cs-sessions') || '[]');
            if (!activeCsSessionIds.includes(clientActiveSession.id)) {
                activeCsSessionIds.push(clientActiveSession.id);
                sessionStorage.setItem('active-cs-sessions', JSON.stringify(activeCsSessionIds));
            }
        } else {
            // If no new consultations exist, create a mock one to show the private room
            clientActiveSession = {
                id: 'chat-mock-active',
                category: 'Sedang',
                date: new Date().toISOString().split('T')[0],
                client: user,
                cs: users.cs2,
                messages: [
                    { id: 'mock-msg-1', author: 'client', content: 'Halo, saya butuh bantuan.', timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })},
                    { id: 'mock-msg-2', author: 'cs', content: 'Tentu, dengan senang hati. Ada yang bisa saya bantu?', timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                ],
            }
        }
        
        setActiveChat(clientActiveSession);

    } catch (e) {
        console.error("Failed to load or create active session", e);
        setError("Gagal memuat sesi konsultasi Anda. Silakan coba lagi nanti.");
    } finally {
        setIsLoading(false);
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
  
  const handleEndChat = () => {
    setShowFeedbackModal(true);
  }

  const handleFeedbackSubmit = (rating: number, description: string) => {
    console.log('Feedback submitted:', { rating, description });
    toast({
      title: 'Terima Kasih!',
      description: 'Feedback Anda telah kami terima.',
    });
    setShowFeedbackModal(false);
    
    // Clear the specific active session from storage
    if (activeChat) {
      try {
        const activeCsSessionIds: string[] = JSON.parse(sessionStorage.getItem('active-cs-sessions') || '[]');
        const updatedActiveSessions = activeCsSessionIds.filter(id => id !== activeChat.id);
        sessionStorage.setItem('active-cs-sessions', JSON.stringify(updatedActiveSessions));
      } catch (e) {
        console.error("Failed to clear active session", e);
      }
    }

    setActiveChat(null); // End the active session in the UI
    setSessionEnded(true); // Show the thank you screen
  };

  const handleStartNewConsultation = () => {
    setSessionEnded(false);
    router.push('/chat');
  };


  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Mempersiapkan Ruang Konsultasi...</p>
      </div>
    );
  }

  if (error) {
     return (
        <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center p-4">
            <Card className="max-w-lg p-8 rounded-2xl shadow-md">
                 <ServerCrash className="mx-auto h-12 w-12 text-destructive mb-4" />
                 <h1 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h1>
                 <p className="text-muted-foreground">{error}</p>
            </Card>
        </div>
    );
  }

  if (sessionEnded) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center p-4">
        <Card className="max-w-lg p-8 md:p-12 rounded-2xl shadow-xl">
          <CircleCheck className="mx-auto h-16 w-16 text-green-500 mb-6" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-3">Terima Kasih!</h1>
          <p className="text-muted-foreground mb-8">
            Masukan Anda telah kami terima. Kami di DirectLine berkomitmen untuk terus meningkatkan kualitas layanan demi kepuasan Anda.
          </p>
          <Button size="lg" onClick={handleStartNewConsultation}>
            Mulai Konsultasi Baru
          </Button>
        </Card>
      </div>
    );
  }

  if (!activeChat) {
     // This case should ideally not be hit frequently with the new logic,
     // but serves as a fallback.
    return (
       <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center p-4">
            <Card className="max-w-lg p-8 rounded-2xl shadow-md">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Tidak Ada Sesi Aktif</h1>
                <p className="text-muted-foreground mb-6">
                   Tidak ada sesi konsultasi yang sedang aktif. Silakan mulai dari halaman Chat.
                </p>
                <Button onClick={() => router.push('/chat')}>Mulai Konsultasi</Button>
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
    <>
     <div className="flex h-[calc(100vh-8rem-2rem)] flex-col items-center">
        <div className="w-full max-w-4xl flex h-full flex-col">
            <Card className="flex flex-1 flex-col rounded-2xl shadow-md overflow-hidden">
                <CardHeader className="flex-row items-center justify-between p-4 bg-background border-b">
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <MessageSquare className="h-6 w-6"/>
                    Ruang Konsultasi
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={handleEndChat}>
                    <LogOut className="mr-0 md:mr-2 h-4 w-4"/>
                    <span className="hidden md:inline">Keluar & Akhiri</span>
                  </Button>
                </CardHeader>
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
    <FeedbackModal
      isOpen={showFeedbackModal}
      onClose={() => setShowFeedbackModal(false)}
      onSubmit={handleFeedbackSubmit}
    />
    </>
  );
}

export default ClientConsultationPage;
