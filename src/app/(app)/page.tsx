import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const announcements = [
  {
    id: 1,
    title: 'Peningkatan Sistem Terjadwal',
    date: '1 Agustus 2024',
    content: 'Kami akan melakukan pemeliharaan sistem untuk meningkatkan performa pada tanggal 5 Agustus 2024.',
    image: { id: 'dashboard-1', hint: 'server technology' },
  },
  {
    id: 2,
    title: 'Fitur Baru: Riwayat Chat',
    date: '25 Juli 2024',
    content: 'Kini Anda dapat melihat kembali percakapan sebelumnya melalui menu Riwayat.',
    image: { id: 'dashboard-2', hint: 'chat application' },
  },
  {
    id: 3,
    title: 'Tips Keamanan Akun',
    date: '20 Juli 2024',
    content: 'Jaga keamanan akun Anda dengan tidak membagikan password kepada siapapun.',
    image: { id: 'dashboard-3', hint: 'cyber security' },
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-center md:p-8">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Selamat Datang di DirectLine!</h1>
            <p className="text-muted-foreground">
              Butuh bantuan? Mulai sesi konsultasi dengan tim support kami sekarang.
            </p>
          </div>
          <Button asChild size="lg" className="w-full sm:w-auto flex-shrink-0">
            <Link href="/chat">
              Mulai Konsultasi <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Newspaper /> Info & Pengumuman</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((post) => (
            <Card key={post.id} className="flex flex-col rounded-2xl shadow-md overflow-hidden">
              <div className="relative w-full h-48">
                 <Image
                  src={`https://picsum.photos/seed/${post.image.id}/600/400`}
                  alt={post.title}
                  fill
                  className="object-cover"
                  data-ai-hint={post.image.hint}
                />
              </div>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.date}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{post.content}</p>
              </CardContent>
              <CardFooter>
                 <Button variant="outline" className="w-full">Baca Selengkapnya</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
