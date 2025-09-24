
'use client';

import Link from 'next/link';
import { chatHistory } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, AreaChart, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Chat } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const StarRating = ({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxRating)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-5 w-5',
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          )}
        />
      ))}
    </div>
  );
};

export default function PerformanceDashboardPage() {
    const ratedChats: Chat[] = chatHistory
        .filter(chat => chat.rating !== undefined && chat.rating > 0)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <AreaChart className="h-7 w-7" />
            Dashboard Kinerja CS
          </h1>
          <p className="text-muted-foreground">
            Tinjau rating kepuasan klien dari setiap sesi konsultasi yang telah selesai.
          </p>
      </div>
      
       <div className="grid gap-4">
        {ratedChats.map((chat) => (
          <Link key={chat.id} href={`/history/${chat.id}`} className="block">
            <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="grid gap-1.5">
                        <CardTitle className="text-base md:text-lg">Konsultasi oleh {chat.client.name}</CardTitle>
                        <CardDescription className="text-sm">
                            Sesi tanggal {chat.date}
                        </CardDescription>
                    </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UserCheck className="h-4 w-4"/>
                        <span>Dilayani oleh: <strong>{chat.cs?.name || 'N/A'}</strong></span>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
                <div className="flex items-center gap-4">
                    <Avatar className='h-12 w-12 hidden sm:flex'>
                        <AvatarImage src={chat.cs?.avatar} alt={chat.cs?.name}/>
                        <AvatarFallback>{chat.cs?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className='grid gap-2'>
                        <p className='font-medium'>Rating Klien:</p>
                        {chat.rating && <StarRating rating={chat.rating} />}
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <Badge 
                        variant={
                        chat.category === 'Kritis' ? 'destructive' :
                        chat.category === 'Tinggi' ? 'default' : 'secondary'
                        }
                        className="capitalize"
                    >
                        {chat.category}
                    </Badge>
                  <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {ratedChats.length === 0 && (
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-8 text-center text-muted-foreground">
              Belum ada riwayat konsultasi dengan rating yang bisa ditampilkan.
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}
