import { chatHistory } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Riwayat Konsultasi</h1>
        <p className="text-muted-foreground">Lihat kembali semua percakapan Anda sebelumnya.</p>
      </div>

      <div className="grid gap-4">
        {chatHistory.map((chat) => (
          <Link key={chat.id} href={`/history/${chat.id}`} legacyBehavior>
            <a className="block">
              <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="grid gap-1.5">
                    <CardTitle className="text-lg">Konsultasi {chat.date}</CardTitle>
                    <CardDescription>
                      {chat.messages.length} pesan dengan {chat.cs?.name}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={
                        chat.category === 'Kritis' ? 'destructive' :
                        chat.category === 'Tinggi' ? 'default' : 'secondary'
                      }
                      className="capitalize"
                    >
                      {chat.category}
                    </Badge>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            </a>
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
