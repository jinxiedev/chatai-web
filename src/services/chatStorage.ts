import { Message } from '../types/chat';

// This service is now deprecated in favor of Firestore
// Keeping for backward compatibility
export function getConversationHistory(chatId: string, senderId: string): Message[] {
  // Return empty array as we now use Firestore
  return [];
}

export function addToConversationHistory(
  chatId: string, 
  senderId: string, 
  role: 'user' | 'assistant', 
  content: string,
  imageUrl?: string
): void {
  // No longer needed as we use Firestore
  console.log('addToConversationHistory is deprecated, using Firestore instead');
}

export function clearConversationHistory(chatId: string, senderId: string): void {
  // No longer needed as we use Firestore
  console.log('clearConversationHistory is deprecated, using Firestore instead');
}