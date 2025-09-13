import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc,
  getDocs,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Message } from '../types/chat';

export const firestoreChatService = {
  // Add message to Firestore
  async addMessage(userId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<void> {
    try {
      await addDoc(collection(db, 'chats'), {
        ...message,
        userId,
        timestamp: Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  // Listen to messages for a user
  onMessagesChange(userId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, 'chats'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const messages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          content: data.content,
          role: data.role,
          timestamp: data.timestamp.toDate(),
          imageUrl: data.imageUrl
        });
      });
      
      // Sort messages by timestamp on client side
      messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      callback(messages);
    });
  },

  // Clear all messages for a user
  async clearMessages(userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'chats'),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error clearing messages:', error);
      throw error;
    }
  }
};