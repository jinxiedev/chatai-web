export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

export interface ChatOptions {
  model?: string;
  imageUrl?: string | null;
  chatId?: string | null;
  senderId?: string | null;
}