
'use client';

import { chatHistory } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, History, Star, Calendar, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';

const StarRating = ({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxRating)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          )}
        />
      ))}
    </div>
  );
};


export default function HistoryPage() {
    const [allConsultations, setAllConsultations] = useState(chatHistory);

    useEffect(() => {
        let consultations = [];
        try {
            const newConsultations = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
            const combined = [...newConsultations, ...chatHistory];
            const uniqueConsultations = Array.from(new Set(combined.map(c => c.id)))
                .map(id => combined.find(c => c.id === id)!);
            consultations = uniqueConsultations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.id.localeCompare(a.id));
        } catch (e) {
            console.error("Failed to load consultations from sessionStorage", e);
            consultations = chatHistory;
        }
        setAllConsultations(consultations);
    }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
          <History className="h-7 w-7" />
          Riwayat Konsultasi
        </h1>
        <p className="text-muted-foreground max-w-2xl">
            Tinjau kembali semua sesi konsultasi yang telah selesai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allConsultations.map((chat, index) => (
          <Link 
            key={chat.id} 
            href={`/history/${chat.id}`} 
            className="block group animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards', opacity: 0 }}
            >
            <Card className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 h-full flex flex-col">
              <CardHeader className="flex-row items-center gap-4">
                 <Avatar className='h-12 w-12 border-2 border-primary/20'>
                    <AvatarImage src={chat.client?.avatar} alt={chat.client?.name}/>
                    <AvatarFallback>{chat.client?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='grid gap-0.5'>
                    <CardTitle className="text-base font-semibold leading-tight">
                        Konsultasi dengan {chat.cs?.name || 'CS'}
                    </CardTitle>
                     <CardDescription className="text-sm flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {chat.date}
                    </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-2"><User className="h-4 w-4"/>Klien</span>
                    <span className="font-medium">{chat.client.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-2"><MessageSquare className="h-4 w-4"/>Total Pesan</span>
                    <span className="font-medium">{chat.messages.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Kategori</span>
                    <Badge 
                        variant={
                        chat.category === 'Kritis' ? 'destructive' :
                        chat.category === 'Tinggi' ? 'default' : 'secondary'
                        }
                        className="capitalize"
                    >
                        {chat.category}
                    </Badge>
                </div>
                {chat.rating && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Rating</span>
                        <StarRating rating={chat.rating} />
                    </div>
                )}
              </CardContent>
              <CardFooter>
                 <div className="flex items-center justify-end text-sm text-primary w-full group-hover:text-primary/80 transition-colors">
                    Lihat Detail
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
        {allConsultations.length === 0 && (
          <Card className="rounded-2xl shadow-md md:col-span-2 lg:col-span-3">
            <CardContent className="p-12 text-center text-muted-foreground">
              <History className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold">Tidak Ada Riwayat</h3>
              <p>Belum ada sesi konsultasi yang selesai.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
