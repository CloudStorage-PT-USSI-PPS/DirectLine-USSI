import type { User, Chat } from '@/lib/types';

export const users: { [key: string]: User } = {
  client: {
    id: 'user-1',
    name: 'Budi Client',
    email: 'budi.client@example.com',
    avatar: 'https://i.pravatar.cc/150?u=client',
    role: 'client',
  },
  cs: {
    id: 'cs-1',
    name: 'Siti Support',
    email: 'siti.support@directline.com',
    avatar: 'https://i.pravatar.cc/150?u=siti',
    role: 'cs',
  },
  cs2: {
    id: 'cs-2',
    name: 'Doni Dermawan',
    email: 'doni.dermawan@directline.com',
    avatar: 'https://i.pravatar.cc/150?u=doni',
    role: 'cs',
  },
  cs3: {
    id: 'cs-3',
    name: 'Rina Ramlan',
    email: 'rina.ramlan@directline.com',
    avatar: 'https://i.pravatar.cc/150?u=rina',
    role: 'cs',
  },
};

export const chatHistory: Chat[] = [
    {
    id: 'chat-4',
    category: 'Kritis',
    date: '2024-07-29',
    client: users.client,
    cs: users.cs2,
    rating: 3,
    messages: [
      { 
        id: 'msg-4-1', 
        author: 'client', 
        content: 'Sistem kami down total, tidak bisa diakses sama sekali. Mohon segera dibantu. Saya lampirkan log terakhir dari server.', 
        timestamp: '09:00',
        file: { name: 'server_log.txt', url: '#' }
      },
      { id: 'msg-4-2', author: 'cs', content: 'Segera kami periksa, Pak Budi. Terima kasih atas lognya, ini sangat membantu.', timestamp: '09:01' },
    ],
  },
  {
    id: 'chat-1',
    category: 'Tinggi',
    date: '2024-07-28',
    client: users.client,
    cs: users.cs,
    rating: 4,
    messages: [
      { 
        id: 'msg-1-1', 
        author: 'client', 
        content: 'Halo, saya mengalami masalah dengan login. Tampilan error-nya seperti ini.', 
        timestamp: '10:30',
        file: { name: 'error-screenshot.png', url: '#' }
      },
      { id: 'msg-1-2', author: 'cs', content: 'Halo Budi, terima kasih atas laporannya. Kami akan periksa screenshot yang Anda kirimkan.', timestamp: '10:31' },
      { id: 'msg-1-3', author: 'client', content: 'Baik, saya tunggu. Saya tidak bisa masuk meskipun password sudah benar.', timestamp: '10:32' },
      { id: 'msg-1-4', author: 'cs', content: 'Baik, kami sedang menganalisis masalahnya. Mohon tunggu sebentar.', timestamp: '10:33' },
    ],
  },
  {
    id: 'chat-2',
    category: 'Sedang',
    date: '2024-07-27',
    client: users.client,
    cs: users.cs,
    rating: 5,
    messages: [
      { id: 'msg-2-1', author: 'client', content: 'Bagaimana cara mengubah profil saya?', timestamp: '14:00' },
      { id: 'msg-2-2', author: 'cs', content: 'Anda bisa pergi ke halaman profil dan klik tombol "Edit Profil".', timestamp: '14:01' },
    ],
  },
  {
    id: 'chat-3',
    category: 'Rendah',
    date: '2024-07-25',
    client: users.client,
    cs: users.cs,
    rating: 5,
    messages: [
      { id: 'msg-3-1', author: 'client', content: 'Terima kasih atas bantuannya!', timestamp: '16:00' },
      { id: 'msg-3-2', author: 'cs', content: 'Sama-sama, senang bisa membantu.', timestamp: '16:01' },
    ],
  },
];
