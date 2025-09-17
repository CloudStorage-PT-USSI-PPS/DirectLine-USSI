'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { ChatMessage, ChatCategory } from '@/lib/types';
import { ChatBox } from '@/components/chat/chat-box';
import { MessageInput } from '@/components/chat/message-input';
import { FeedbackModal } from '@/components/chat/feedback-modal';
import { users } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { initiateConsultationAnalysis } from '@/lib/actions';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [category, setCategory] = useState<ChatCategory>('Sedang');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isCsTyping, setIsCsTyping] = useState(false);

  useEffect(() => {
    if (user) {
      setMessages([
        {
          id: 'welcome-msg',
          author: 'system',
          content: `Halo USSIANS, selamat datang di DirectLine. Silakan jelaskan masalah Anda.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [user]);

  const handleSendMessage = async (content: string, file?: File) => {
    if (!user) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: 'client',
      content,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...(file && { file: { name: file.name, url: '#' } }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsCsTyping(true);

    if (messages.filter(m => m.author === 'client').length === 0) {
      // First client message, trigger AI analysis
      try {
        const analysis = await initiateConsultationAnalysis({ initialMessage: content });
        const systemMessage: ChatMessage = {
          id: `system-${Date.now()}`,
          author: 'system',
          content: `Menganalisis permintaan... Ditemukan kata kunci: "${analysis.keywords}". Menghubungkan ke tim: ${analysis.suggestedSupportStaff}.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, systemMessage]);
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
      setMessages((prev) => [...prev, csReply]);
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
          setMessages((prev) => [...prev, endMessage]);
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
    // setMessages([]);
  };

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
      <div className="w-full max-w-4xl flex h-full flex-col space-y-4">
        <div className='flex items-center gap-4'>
          <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <MessageSquare className="h-6 w-6" />
            <h1>Ruang Konsultasi</h1>
          </div>
        </div>
        <Card className="flex flex-1 flex-col rounded-2xl shadow-md">
          <ChatBox messages={messages} currentUser={user} csUser={users.cs} isCsTyping={isCsTyping} />
          <MessageInput
            onSendMessage={handleSendMessage}
            category={category}
            onCategoryChange={setCategory}
          />
        </Card>
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleFeedbackSubmit}
        />
      </div>
    </div>
  );
}
