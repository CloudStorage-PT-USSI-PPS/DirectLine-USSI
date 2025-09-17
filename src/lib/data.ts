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
    id: 'chat-1',
    category: 'Tinggi',
    date: '2024-07-28',
    client: users.client,
    cs: users.cs,
    messages: [
      { id: 'msg-1-1', author: 'client', content: 'Halo, saya mengalami masalah dengan login.', timestamp: '10:30' },
      { id: 'msg-1-2', author: 'cs', content: 'Halo Budi, bisa dijelaskan lebih detail masalahnya?', timestamp: '10:31' },
      { id: 'msg-1-3', author: 'client', content: 'Saya tidak bisa masuk meskipun password sudah benar.', timestamp: '10:32' },
      { id: 'msg-1-4', author: 'cs', content: 'Baik, kami akan periksa. Mohon tunggu sebentar.', timestamp: '10:33' },
    ],
  },
  {
    id: 'chat-2',
    category: 'Sedang',
    date: '2024-07-27',
    client: users.client,
    cs: users.cs,
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
    messages: [
      { id: 'msg-3-1', author: 'client', content: 'Terima kasih atas bantuannya!', timestamp: '16:00' },
      { id: 'msg-3-2', author: 'cs', content: 'Sama-sama, senang bisa membantu.', timestamp: '16:01' },
    ],
  },
];
