
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
    const loadMessages = () => {
      let storageKey = CHAT_STORAGE_KEY;
      
      // Use user-specific storage if user is logged in
      if (user) {
        storageKey = `${CHAT_STORAGE_KEY}_${user.id}`;
      }
      
      const storedMessages = localStorage.getItem(storageKey);
      
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          
          // Filter out any duplicate mode messages that might have been stored
          const filteredMessages = parsedMessages.filter((msg: Message, index: number, arr: Message[]) => {
            if (!msg.mode || msg.isUser) return true;
            
            // Keep only the first occurrence of each mode message
            const firstModeIndex = arr.findIndex((m: Message) => 
              m.mode === msg.mode && 
              !m.isUser && 
              m.text.includes('Mode') && 
              (m.text.includes('Activated') || m.text.includes('Mode!'))
            );
            
            return index === firstModeIndex;
          });
          
          console.log('🔄 Loaded messages from storage:', parsedMessages.length, 'filtered to:', filteredMessages.length);
          
          // Log image data for debugging
          filteredMessages.forEach(msg => {
            if (msg.image) {
              console.log(`Message ${msg.id} has image data:`, msg.image.length, 'characters');
            }
          });
          
          // Only update if we have more than just the welcome message
          if (filteredMessages.length > 1) {
            setMessages(filteredMessages);
          }
        } catch (error) {
          console.error('Failed to parse stored chat messages:', error);
        }
      }
    };

    // Load messages immediately
    loadMessages();
    
    // Also load messages when user state changes
    if (user) {
      setTimeout(loadMessages, 100); // Small delay to ensure user is fully loaded
    }
  }, [user]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 1) { // Don't save if only welcome message
      let storageKey = CHAT_STORAGE_KEY;
      
      // Use user-specific storage if user is logged in, otherwise use general storage
      if (user) {
        storageKey = `${CHAT_STORAGE_KEY}_${user.id}`;
      }
      
      // Filter out duplicate mode messages before saving
      const messagesToSave = messages.filter((msg, index) => {
        if (!msg.mode || msg.isUser) return true;
        
        // Keep only the first occurrence of each mode message
        const firstModeIndex = messages.findIndex((m) => 
          m.mode === msg.mode && 
          !m.isUser && 
          m.text.includes('Mode') && 
          (m.text.includes('Activated') || m.text.includes('Mode!'))
        );
        
        return index === firstModeIndex;
      });
      
      // Log storage operation
      const imagesCount = messagesToSave.filter(msg => msg.image).length;
      console.log(`💾 Saving ${messagesToSave.length} messages to storage (${imagesCount} with images) with key: ${storageKey}`);
      
      try {
        localStorage.setItem(storageKey, JSON.stringify(messagesToSave));
        console.log('✅ Messages saved successfully to storage');
      } catch (error) {
        console.error('❌ Failed to save messages to storage:', error);
        // If storage is full, try to save without images
        const messagesWithoutImages = messagesToSave.map(msg => ({
          ...msg,
          image: undefined
        }));
        try {
          localStorage.setItem(storageKey, JSON.stringify(messagesWithoutImages));
          console.log('✅ Messages saved without images due to storage constraints');
        } catch (fallbackError) {
          console.error('❌ Failed to save messages even without images:', fallbackError);
        }
      }
    }
  }, [messages, user]);

  const addMessage = (message: Message) => {
    console.log('Adding message:', message.id, message.text.substring(0, 50) + '...', 'Has image:', !!message.image);
    
    // Prevent adding duplicate mode messages
    if (message.mode && !message.isUser && message.text.includes('Mode')) {
      const existingModeMessage = messages.find(m => 
        m.mode === message.mode && 
        !m.isUser && 
        m.text.includes('Mode') && 
        (m.text.includes('Activated') || m.text.includes('Mode!'))
      );
      
      if (existingModeMessage) {
        console.log('Preventing duplicate mode message for:', message.mode);
        return;
      }
    }
    
    setMessages(prev => [...prev, message]);
  };

  const clearChatHistory = () => {
    const welcomeMessage = {
      id: '1',
      text: "Hi! I'm GlutenConvert, your AI recipe assistant. I can help you create gluten-free recipes, convert existing recipes, scan ingredients for safety, or answer any gluten-free cooking questions. What would you like to do today?",
      isUser: false,
      timestamp: new Date(),
    };
    
    console.log('🗑️ Clearing chat history');
    
    // Clear both user-specific and general storage
    if (user) {
      const userStorageKey = `${CHAT_STORAGE_KEY}_${user.id}`;
      localStorage.removeItem(userStorageKey);
    }
    localStorage.removeItem(CHAT_STORAGE_KEY);
    
    setMessages([welcomeMessage]);
  };

  return {
    messages,
    setMessages,
    addMessage,
    clearChatHistory
  };
};
