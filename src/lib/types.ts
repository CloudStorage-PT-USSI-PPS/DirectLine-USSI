export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'client' | 'cs';
};

export type ChatMessage = {
  id: string;
  author: 'client' | 'cs' | 'system';
  content: string;
  timestamp: string;
  file?: {
    name: string;
    url: string;
  };
};

export type ChatCategory = 'Kritis' | 'Tinggi' | 'Sedang' | 'Rendah';

export type Chat = {
  id: string;
  category: ChatCategory;
  date: string;
  messages: ChatMessage[];
  client: User;
  cs?: User;
};

export type Feedback = {
  rating: number;
  description: string;
};
