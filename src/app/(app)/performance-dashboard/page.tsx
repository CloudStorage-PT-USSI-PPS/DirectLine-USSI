
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
    <div className="flex items-center">
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
    <div className="space-y-8">
      <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <AreaChart className="h-7 w-7" />
            Dashboard Kinerja CS
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Tinjau metrik kepuasan klien dan detail dari setiap sesi konsultasi yang telah selesai untuk evaluasi kinerja.
          </p>
      </div>
      
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ratedChats.map((chat, index) => (
          <Link 
            key={chat.id} 
            href={`/history/${chat.id}`} 
            className="block animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards', opacity: 0 }}
          >
            <Card className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 h-full flex flex-col">
              <CardHeader className="flex-row items-center gap-4">
                <Avatar className='h-12 w-12'>
                    <AvatarImage src={chat.cs?.avatar} alt={chat.cs?.name}/>
                    <AvatarFallback>{chat.cs?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='grid gap-0.5'>
                    <CardTitle className="text-base font-semibold leading-tight">
                        {chat.cs?.name || 'N/A'}
                    </CardTitle>
                     <CardDescription className="text-sm flex items-center gap-1.5">
                        Melayani {chat.client.name}
                    </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className='grid gap-4'>
                    <div className='flex items-center justify-between'>
                        <span className='text-sm text-muted-foreground'>Rating:</span>
                        {chat.rating && <StarRating rating={chat.rating} />}
                    </div>
                    <div className='flex items-center justify-between'>
                         <span className='text-sm text-muted-foreground'>Kategori:</span>
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
                    <div className='flex items-center justify-between'>
                         <span className='text-sm text-muted-foreground'>Tanggal:</span>
                         <span className='text-sm font-medium'>{chat.date}</span>
                    </div>
                </div>
                <div className="flex items-center justify-end text-sm text-muted-foreground mt-6">
                    Lihat Detail
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {ratedChats.length === 0 && (
          <Card className="rounded-2xl shadow-md md:col-span-2 lg:col-span-3">
            <CardContent className="p-8 text-center text-muted-foreground">
              Belum ada riwayat konsultasi dengan rating yang bisa ditampilkan.
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}
