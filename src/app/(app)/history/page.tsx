
import { chatHistory } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, History, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-2xl md:text-3xl font-bold tracking-tight">
        <History className="h-7 w-7 md:h-8 md:w-8" />
        <h1>Riwayat Konsultasi</h1>
      </div>

      <div className="grid gap-4">
        {chatHistory.map((chat) => (
          <Link key={chat.id} href={`/history/${chat.id}`} className="block">
            <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="grid gap-1.5">
                  <CardTitle className="text-base md:text-lg">Konsultasi {chat.date}</CardTitle>
                  <CardDescription className="text-sm">
                    {chat.messages.length} pesan dengan {chat.cs?.name}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    {chat.rating && <StarRating rating={chat.rating} />}
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
              </CardHeader>
            </Card>
          </Link>
        ))}
        {chatHistory.length === 0 && (
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-8 text-center text-muted-foreground">
              Tidak ada riwayat konsultasi.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
