
'use client';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Clock, Users, BarChart, Paperclip, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { chatHistory } from '@/lib/data';
import type { Chat } from '@/lib/types';


// Mock data for stats
const stats = [
    { title: "Total Konsultasi", value: "125", icon: MessageSquare, change: "+15.2%" },
    { title: "Waktu Respon Rata-rata", value: "2m 15s", icon: Clock, change: "-3.5%" },
    { title: "Klien Aktif", value: "32", icon: Users, change: "+5" },
    { title: "Tingkat Kepuasan", value: "95%", icon: BarChart, change: "+1.2%" },
];

export default function CSDashboardPage() {
    let allConsultations: Chat[] = [];
    if (typeof window !== 'undefined') { // Ensure code runs only on the client
        try {
            const newConsultations: Chat[] = JSON.parse(sessionStorage.getItem('new-consultations') || '[]');
            
            const combined = [...newConsultations, ...chatHistory];
            const uniqueConsultations = Array.from(new Set(combined.map(c => c.id)))
                .map(id => combined.find(c => c.id === id)!);
                
            allConsultations = uniqueConsultations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.id.localeCompare(a.id));
        } catch (e) {
            console.error("Failed to load consultations from sessionStorage", e);
            allConsultations = chatHistory;
        }
    } else {
        allConsultations = chatHistory;
    }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
        <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard Customer Support</h1>
            <p className="text-muted-foreground">
              Selamat datang kembali! Berikut adalah ringkasan aktivitas hari ini.
            </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title} className="rounded-2xl shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.change} from kemarin</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      
      <Card className="rounded-2xl shadow-md overflow-hidden">
        <CardHeader>
          <CardTitle>Permintaan Konsultasi Masuk</CardTitle>
          <CardDescription>Berikut adalah daftar konsultasi terbaru yang membutuhkan perhatian Anda.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Klien</TableHead>
                    <TableHead className="hidden md:table-cell">Asal BPR</TableHead>
                    <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="hidden lg:table-cell">Pesan Awal</TableHead>
                    <TableHead className="hidden md:table-cell">Lampiran</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allConsultations.map((chat) => (
                        <TableRow key={chat.id}>
                            <TableCell>
                                <div className="font-medium">{chat.client.name}</div>
                                <div className="text-sm text-muted-foreground hidden md:inline">{chat.client.email}</div>
                            </TableCell>
                             <TableCell className="hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-muted-foreground"/>
                                  <span>{chat.client.bprName || '-'}</span>
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">{chat.date}</TableCell>
                            <TableCell>
                                <Badge 
                                    variant={
                                    chat.category === 'Kritis' ? 'destructive' :
                                    chat.category === 'Tinggi' ? 'default' : 'secondary'
                                    }
                                    className="capitalize"
                                >
                                    {chat.category}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell max-w-xs truncate">{chat.messages[0].content}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                {chat.messages[0].file && (
                                    <div className='flex items-center justify-center'>
                                        <Paperclip className="h-4 w-4" />
                                        <span className='sr-only'>Ada Lampiran</span>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button asChild size="sm">
                                    <Link href={`/konsultasi?session=${chat.id}`}>
                                        Tanggapi
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
        <CardFooter className="justify-end pt-4 border-t">
            <Button asChild variant="outline">
                <Link href="/history">
                    Lihat Semua Riwayat <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
