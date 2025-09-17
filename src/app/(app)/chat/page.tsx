
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { ChatMessage, ChatCategory, User } from '@/lib/types';
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


const AvailableCS = ({ csList }: { csList: User[] }) => (
  <Card className="hidden lg:block w-80 rounded-2xl shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        CS Tersedia
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
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
  const { hasSessionStarted, startSession, messages, addMessage, addMessages, clearMessages } = useChatSession();
  const [category, setCategory] = useState<ChatCategory>('Sedang');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [isCsTyping, setIsCsTyping] = useState(false);

  const csList = Object.values(users).filter(u => u.role === 'cs');

  useEffect(() => {
    if (user && !hasSessionStarted) {
      setShowStartModal(true);
    }
  }, [user, hasSessionStarted]);

  const handleStartConsultation = (initialMessage: string, category: ChatCategory) => {
    startSession(); 
    setCategory(category);
    setShowStartModal(false);
    
    const welcomeMessage: ChatMessage = {
      id: 'welcome-msg',
      author: 'system',
      content: `Halo USSIANS, selamat datang di DirectLine. Sesi Anda telah dimulai dengan prioritas "${category}".`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    addMessage(welcomeMessage);
    handleSendMessage(initialMessage);
  };

  const handleCloseModal = () => {
    if (!hasSessionStarted) {
        startSession();
    }
    setShowStartModal(false);
  }


  const handleSendMessage = async (content: string, file?: File) => {
    if (!user || !content.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: 'client',
      content,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...(file && { file: { name: file.name, url: '#' } }),
    };

    addMessage(newMessage);
    setIsCsTyping(true);

    if (messages.filter(m => m.author === 'client').length === 1) { // Only analyze first message
      // First client message, trigger AI analysis
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

    // Simulate CS reply
    setTimeout(() => {
      const csReply: ChatMessage = {
        id: `cs-msg-${Date.now()}`,
        author: 'cs',
        content: 'Baik, terima kasih atas informasinya. Kami sedang memeriksa masalah Anda.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      addMessage(csReply);
      setIsCsTyping(false);
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
    }, 2500);
  };

  const handleFeedbackSubmit = (rating: number, description: string) => {
    console.log('Feedback submitted:', { rating, description });
    toast({
      title: 'Terima Kasih!',
      description: 'Feedback Anda telah kami terima.',
    });
    setShowFeedbackModal(false);
    // Optionally reset chat
    // clearMessages();
  };

  if (!user) return null;

  return (
    <>
      <StartConsultationModal 
        isOpen={showStartModal}
        onClose={handleCloseModal}
        onSubmit={handleStartConsultation}
      />
      <div className="flex flex-col h-full items-center justify-center gap-6">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <MessageSquare className="h-6 w-6" />
          <h1>Ruang Konsultasi</h1>
        </div>
        <div className="flex flex-1 gap-6 overflow-hidden w-full max-w-6xl">
          <Card className="flex flex-1 flex-col rounded-2xl shadow-md">
            {!hasSessionStarted && messages.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-muted-foreground">Memulai sesi konsultasi...</p>
              </div>
            ) : (
              <>
                <ChatBox messages={messages} currentUser={user} csUser={users.cs} isCsTyping={isCsTyping} />
                <MessageInput
                  onSendMessage={handleSendMessage}
                  category={category}
                  onCategoryChange={() => {}}
                  isCategoryDisabled={true}
                />
              </>
            )}
          </Card>
          <AvailableCS csList={csList} />
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
