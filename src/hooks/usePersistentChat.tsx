
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  mode?: string;
  image?: string;
  convertedRecipe?: string;
}

const CHAT_STORAGE_KEY = 'gluten_convert_chat_history';

export const usePersistentChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm GlutenConvert, your AI recipe assistant. I can help you create gluten-free recipes, convert existing recipes, scan ingredients for safety, or answer any gluten-free cooking questions. What would you like to do today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);

  // Load messages from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const userStorageKey = `${CHAT_STORAGE_KEY}_${user.id}`;
      const storedMessages = localStorage.getItem(userStorageKey);
      
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(parsedMessages);
        } catch (error) {
          console.error('Failed to parse stored chat messages:', error);
        }
      }
    }
  }, [user]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (user && messages.length > 1) { // Don't save if only welcome message
      const userStorageKey = `${CHAT_STORAGE_KEY}_${user.id}`;
      localStorage.setItem(userStorageKey, JSON.stringify(messages));
    }
  }, [messages, user]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearChatHistory = () => {
    const welcomeMessage = {
      id: '1',
      text: "Hi! I'm GlutenConvert, your AI recipe assistant. I can help you create gluten-free recipes, convert existing recipes, scan ingredients for safety, or answer any gluten-free cooking questions. What would you like to do today?",
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    
    if (user) {
      const userStorageKey = `${CHAT_STORAGE_KEY}_${user.id}`;
      localStorage.removeItem(userStorageKey);
    }
  };

  return {
    messages,
    setMessages,
    addMessage,
    clearChatHistory
  };
};
