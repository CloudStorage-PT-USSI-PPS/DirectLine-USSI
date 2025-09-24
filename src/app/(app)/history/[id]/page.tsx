
'use client';
    
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { chatHistory, users } from '@/lib/data';
import { ChatBox } from '@/components/chat/chat-box';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HistoryDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const chat = chatHistory.find((c) => c.id === id);

  if (!chat) {
    notFound();
  }

  // For display purposes, the current user is always the client.
  const currentUser = users.client;
  const csUser = users.cs;

  return (
    <div className="flex h-[calc(100vh-8rem-2rem)] flex-col items-center">
      <div className="w-full max-w-4xl flex h-full flex-col space-y-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
              <Link href="/history">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Kembali</span>
              </Link>
          </Button>
          <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Detail Konsultasi</h1>
              <p className="text-sm text-muted-foreground">Percakapan tanggal {chat.date}</p>
          </div>
        </div>
        
        <Card className="flex flex-1 flex-col rounded-2xl shadow-md overflow-hidden">
          <ChatBox messages={chat.messages} currentUser={currentUser} csUser={csUser} isCsTyping={false} />
        </Card>
      </div>
    </div>
  );
}
