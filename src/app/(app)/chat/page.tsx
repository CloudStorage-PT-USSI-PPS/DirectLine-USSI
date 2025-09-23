'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { ChatMessage, ChatCategory, User, Chat } from '@/lib/types';
import { ChatBox } from '@/components/chat/chat-box';
import { MessageInput } from '@/components/chat/message-input';
import { FeedbackModal } from '@/components/chat/feedback-modal';
import { StartConsultationModal } from '@/components/chat/start-consultation-modal';
import { users } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { initiateConsultationAnalysis } from '@/lib/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageSquare, Users, Circle } from 'lucide-react';
import { useChatSession } from '@/components/providers/chat-session-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatRoom } from '@/components/chat/chat-room';


const AvailableCS = ({ csList }: { csList: User[] }) => (
  <Card className="hidden lg:block w-full lg:max-w-xs rounded-2xl shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        CS Tersedia
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 pt-6">
      {csList.map(cs => (
        <div key={cs.id} className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={cs.avatar} alt={cs.name} />
            <AvatarFallback>{cs.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{cs.name}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Circle className="h-2 w-2 fill-green-500 text-green-500" />
              <span>Online</span>
            </div>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { hasSessionStarted, startSession, messages, addMessage } = useChatSession();
  const [category, setCategory] = useState<ChatCategory>('Sedang');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);

  const csList = Object.values(users).filter(u => u.role === 'cs');

  useEffect(() => {
    if (user && !hasSessionStarted) {
      setShowStartModal(true);
    }
  }, [user, hasSessionStarted]);

  const handleStartConsultation = (initialMessage: string, category: ChatCategory, file?: File) => {
    if (!user) return;
  
    startSession();
    setCategory(category);
    setShowStartModal(false);
  
    const firstMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: 'client',
      content: initialMessage,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...(file && { file: { name: file.name, url: URL.createObjectURL(file) } }),
    };
  
    // Simulate saving the new chat to a shared place (like a database)
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      category,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      client: user,
      cs: users.cs, // Assign a default CS for now
      messages: [firstMessage], // Start with the first message
      rating: undefined,
    };
  
    try {
      const existingChats = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
      sessionStorage.setItem('new-consultations', JSON.stringify([newChat, ...existingChats]));
    } catch (e) {
      console.error("Failed to save new consultation to sessionStorage", e);
    }
  
    const welcomeMessage: ChatMessage = {
      id: 'welcome-msg',
      author: 'system',
      content: `Halo USSIANS, selamat datang di DirectLine. Sesi Anda telah dimulai dengan prioritas "${category}".`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
  
    // The welcome message should come first
    addMessage(welcomeMessage);
    // Then the user's first message
    handleSendMessage(firstMessage.content, file, firstMessage);
  };
  

  const handleCloseModal = () => {
    if (!hasSessionStarted) {
        startSession();
    }
    setShowStartModal(false);
  }


  const handleSendMessage = async (content: string, file?: File, existingMessage?: ChatMessage) => {
    if (!user || (!content.trim() && !file && !existingMessage)) return;
  
    let newMessage: ChatMessage;
    if (existingMessage) {
        newMessage = existingMessage;
        addMessage(newMessage); // Add the user's first message to the UI
    } else {
        newMessage = {
          id: `msg-${Date.now()}`,
          author: 'client',
          content,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          ...(file && { file: { name: file.name, url: URL.createObjectURL(file) } }),
        };
        addMessage(newMessage);
    }
  
    // Only analyze the very first client message of the session
    const isFirstClientMessage = messages.filter(m => m.author === 'client').length === 0;
  
    if (isFirstClientMessage && content.trim()) { 
      try {
        const analysis = await initiateConsultationAnalysis({ initialMessage: content });
        const systemMessage: ChatMessage = {
          id: `system-${Date.now()}`,
          author: 'system',
          content: `Menganalisis permintaan... Ditemukan kata kunci: "${analysis.keywords}". Menghubungkan ke tim: ${analysis.suggestedSupportStaff}.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        addMessage(systemMessage);
        toast({
          title: "Konsultasi Dianalisis",
          description: `Anda akan dihubungkan dengan tim ${analysis.suggestedSupportStaff}.`,
        });
      } catch (error) {
        toast({
          title: "Analisis Gagal",
          description: "Gagal menganalisis permintaan Anda, tetapi kami tetap akan menghubungkan Anda.",
          variant: "destructive",
        });
      }
    }
  
    // Simulate CS reply after analysis or immediately
    const replyDelay = isFirstClientMessage ? 2500 : 1000;
    
    // Simulate CS reply
    return new Promise<void>(resolve => {
        setTimeout(() => {
            const csReply: ChatMessage = {
              id: `cs-msg-${Date.now()}`,
              author: 'cs',
              content: 'Baik, terima kasih atas informasinya. Kami sedang memeriksa masalah Anda.',
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            };
            addMessage(csReply);
            toast({
              title: "Pesan Baru",
              description: "Customer Support telah membalas.",
            });
            
            // Simulate end of chat and show feedback modal
            if (content.toLowerCase().includes('terima kasih')) {
              setTimeout(() => {
                const endMessage: ChatMessage = {
                  id: `end-${Date.now()}`,
                  author: 'system',
                  content: 'Sesi konsultasi telah berakhir. Mohon berikan feedback Anda.',
                  timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                };
                addMessage(endMessage);
                setShowFeedbackModal(true);
              }, 2000);
            }
            resolve();
          }, replyDelay);
    });
  };

  const handleFeedbackSubmit = (rating: number, description: string) => {
    console.log('Feedback submitted:', { rating, description });
    toast({
      title: 'Terima Kasih!',
      description: 'Feedback Anda telah kami terima.',
    });
    setShowFeedbackModal(false);
  };
  
  if (!user) return null;

  return (
    <>
      <StartConsultationModal 
        isOpen={showStartModal}
        onClose={handleCloseModal}
        onSubmit={handleStartConsultation}
      />
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
        <div className="w-full max-w-6xl flex flex-col gap-6 h-full">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold tracking-tight">
              <MessageSquare className="h-6 w-6" />
              <h1>Ruang Konsultasi</h1>
            </div>
            <div className="flex flex-1 gap-6 overflow-hidden">
              <div className="flex-1 flex flex-col h-full">
                {hasSessionStarted || messages.length > 0 ? (
                  <ChatRoom
                    messages={messages}
                    user={user}
                    csUser={users.cs} // Default CS for simulation
                    onSendMessage={handleSendMessage}
                    isCategoryDisabled={true}
                    category={category}
                    onCategoryChange={setCategory}
                  />
                ) : (
                  <Card className="flex flex-1 items-center justify-center p-4 text-center rounded-2xl shadow-md">
                    <p className="text-muted-foreground">Memulai sesi konsultasi... Silakan mulai dari pop-up yang muncul.</p>
                  </Card>
                )}
              </div>
              <AvailableCS csList={csList} />
            </div>
        </div>
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleFeedbackSubmit}
        />
      </div>
    </>
  );
}
