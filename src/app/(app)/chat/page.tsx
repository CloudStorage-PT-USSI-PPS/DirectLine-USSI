
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { ChatMessage, ChatCategory, User, Chat } from '@/lib/types';
import { StartConsultationModal } from '@/components/chat/start-consultation-modal';
import { users } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { initiateConsultationAnalysis } from '@/lib/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageSquare, Users, Circle, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const AvailableCS = ({ csList }: { csList: User[] }) => (
  <Card 
    className="w-full lg:max-w-xs rounded-2xl shadow-md animate-fade-in-up"
    style={{ animationDelay: '200ms', animationFillMode: 'forwards', opacity: 0 }}
  >
    <CardHeader>
      <CardTitle className="flex items-center gap-3">
        <Users className="h-6 w-6" />
        CS Tersedia
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 pt-4">
      {csList.map((cs, index) => (
        <div 
            key={cs.id} 
            className="flex items-center gap-4 animate-fade-in-up"
            style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: 'forwards', opacity: 0 }}
        >
          <Avatar className="h-11 w-11 border-2 border-primary/20">
            <AvatarImage src={cs.avatar} alt={cs.name} />
            <AvatarFallback>{cs.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-base">{cs.name}</p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Circle className="h-2.5 w-2.5 fill-green-500 text-green-500" />
              <span>Online</span>
            </div>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default function RequestPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [showStartModal, setShowStartModal] = useState(false);

  const csList = Object.values(users).filter(u => u.role === 'cs');

  useEffect(() => {
    // Automatically open the modal if user lands on this page.
    // We can add logic here to check if there's already an active request.
    const allConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
    const clientActiveSession = allConsultations.find(chat => chat.client.id === user?.id);

    if (!clientActiveSession) {
      setShowStartModal(true);
    }
  }, [user]);


  const handleStartConsultation = async (initialMessage: string, category: ChatCategory, file?: File) => {
    if (!user) return;
  
    const firstMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: 'client',
      content: initialMessage,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...(file && { file: { name: file.name, url: URL.createObjectURL(file) } }),
    };
  
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      category,
      date: new Date().toISOString().split('T')[0],
      client: user,
      cs: users.cs, // Placeholder CS
      messages: [firstMessage],
      rating: undefined,
    };
  
    try {
      const existingChats: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
      sessionStorage.setItem('new-consultations', JSON.stringify([newChat, ...existingChats]));

       // AI Analysis
      const analysis = await initiateConsultationAnalysis({ initialMessage });
      toast({
        title: "Permintaan Dianalisis",
        description: `Kata kunci: "${analysis.keywords}". Tim yang disarankan: ${analysis.suggestedSupportStaff}.`,
      });

    } catch (e) {
      console.error("Failed to save new consultation or analyze", e);
       toast({
          title: "Analisis Gagal",
          description: "Gagal menganalisis permintaan Anda, tetapi permintaan Anda tetap kami kirim.",
          variant: "destructive",
        });
    } finally {
        setShowStartModal(false);
        toast({
            title: "Permintaan Terkirim",
            description: "Permintaan konsultasi Anda telah berhasil dikirim. Silakan tunggu respons dari tim CS.",
        });
        // Redirect user to consultation page to wait
        router.push('/konsultasi');
    }
  };
  
  const handleCloseModal = () => {
    setShowStartModal(false);
    // If user closes modal, maybe redirect them to a dashboard or another relevant page.
    // For now, we'll just close it.
  }
  
  if (!user) return null;

  return (
    <>
      <StartConsultationModal 
        isOpen={showStartModal}
        onClose={handleCloseModal}
        onSubmit={handleStartConsultation}
      />
      <div className="flex flex-col gap-8">
        <div 
            className="flex items-center justify-center gap-3 text-3xl font-bold tracking-tight animate-fade-in-up"
            style={{ animationDelay: '0ms', animationFillMode: 'forwards', opacity: 0 }}
        >
          <MessageSquare className="h-8 w-8" />
          <h1>Permintaan Konsultasi</h1>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <Card 
            className="flex-1 w-full animate-fade-in-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards', opacity: 0 }}
          >
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-3">Mulai Sesi Baru</h2>
              <p className="text-muted-foreground mb-6">
                Klik tombol di bawah untuk membuka formulir permintaan konsultasi. Jelaskan masalah Anda dan tim kami akan segera membantu.
              </p>
              <Button onClick={() => setShowStartModal(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Buat Permintaan Konsultasi
              </Button>
            </CardContent>
          </Card>
          <div className="w-full lg:w-auto">
            <AvailableCS csList={csList} />
          </div>
        </div>
      </div>
    </>
  );
}
