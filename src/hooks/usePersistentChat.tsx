
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/types/chat';

const CHAT_STORAGE_KEY = 'gluten_convert_chat_history';

export const usePersistentChat = () => {
  const { user } = useAuth();
  
  // CRITICAL: Initialize messages as empty and load from storage immediately
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  console.log('🔥 usePersistentChat HOOK CALLED - isInitialized:', isInitialized, 'messages length:', messages.length);

  // Load messages from localStorage when component mounts or user changes
  useEffect(() => {
    // Only run if not already initialized or if user changes
    if (isInitialized && messages.length > 0) {
      console.log('🚀 Skipping load - already initialized with', messages.length, 'messages');
      return;
    }
    
    console.log('🚀 usePersistentChat useEffect TRIGGERED - user changed:', user?.id);
    console.log('🚀 Current messages count before loading:', messages.length);
    const loadMessages = () => {
      console.log('🔍 loadMessages() called - checking localStorage...');
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
          
          console.log('🔄 CHAT RESTORE: Loading messages from storage:', parsedMessages.length, 'filtered to:', filteredMessages.length);
          console.log('💾 PERMANENT CHAT: All messages will persist forever - no auto-deletion');
          
          // Log image data for debugging
          filteredMessages.forEach(msg => {
            if (msg.image) {
              console.log(`Message ${msg.id} has image data:`, msg.image.length, 'characters');
            }
          });
          
          // ALWAYS load stored messages - they should persist forever
          if (filteredMessages.length > 0) {
            console.log('🔒 FORCE RESTORING CHAT MESSAGES - NO EXCEPTIONS');
            setMessages(filteredMessages);
            setIsInitialized(true);
            console.log('✅ PERMANENT CHAT: Restored', filteredMessages.length, 'messages from storage');
          } else {
            console.log('⚠️ No stored messages found, setting default welcome message');
            const welcomeMessage = {
              id: '1',
              text: "Hi! I'm GlutenConvert, your AI recipe assistant. I can help you create gluten-free recipes, convert existing recipes, scan ingredients for safety, or answer any gluten-free cooking questions. What would you like to do today?",
              isUser: false,
              timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
            setIsInitialized(true);
          }
        } catch (error) {
          console.error('❌ Failed to parse stored chat messages:', error);
        }
      } else {
        console.log('📭 No stored chat messages found in localStorage for key:', storageKey);
        if (!isInitialized) {
          const welcomeMessage = {
            id: '1',
            text: "Hi! I'm GlutenConvert, your AI recipe assistant. I can help you create gluten-free recipes, convert existing recipes, scan ingredients for safety, or answer any gluten-free cooking questions. What would you like to do today?",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
          setIsInitialized(true);
        }
      }
    };

    // CRITICAL: Load messages immediately and FORCEFULLY
    console.log('🚀 INITIALIZING CHAT PERSISTENCE - LOADING NOW - messages count before:', messages.length);
    loadMessages();
    
    // Also load messages when user state changes - but with protection against double loading
    if (user) {
      console.log('👤 User state changed, re-loading chat messages after short delay');
      setTimeout(() => {
        loadMessages();
      }, 100); // Small delay to ensure user is fully loaded
    }
  }, [user]); // Remove isInitialized to prevent dependency loop

  // Save messages to localStorage whenever messages change - PERMANENT STORAGE
  useEffect(() => {
    // ALWAYS save all messages - they should persist forever
    if (messages.length > 0) {
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
      
      // Log storage operation with permanent storage emphasis
      const imagesCount = messagesToSave.filter(msg => msg.image).length;
      const recipesCount = messagesToSave.filter(msg => msg.text.includes('Recipe') || msg.convertedRecipe).length;
      console.log(`💾 PERMANENT STORAGE: Saving ${messagesToSave.length} messages (${imagesCount} with images, ${recipesCount} recipes) with key: ${storageKey}`);
      
      try {
        localStorage.setItem(storageKey, JSON.stringify(messagesToSave));
        console.log('✅ PERMANENT CHAT: All messages saved successfully - will persist forever');
      } catch (error) {
        console.error('❌ Failed to save messages to storage:', error);
        // If storage is full, try to save without images but KEEP ALL TEXT AND RECIPES
        const messagesWithoutImages = messagesToSave.map(msg => ({
          ...msg,
          image: undefined
        }));
        try {
          localStorage.setItem(storageKey, JSON.stringify(messagesWithoutImages));
          console.log('✅ PERMANENT CHAT: Messages saved without images but all text/recipes preserved');
        } catch (fallbackError) {
          console.error('❌ CRITICAL: Failed to save messages even without images:', fallbackError);
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
    
    console.log('🔴 addMessage called - current messages length:', messages.length, 'adding:', message.id);
    setMessages(prev => [...prev, message]);
  };

  const clearChatHistory = () => {
    console.log('🚨 CRITICAL WARNING: clearChatHistory called - this should ONLY happen on explicit user "Reset Chat" action');
    
    const welcomeMessage = {
      id: '1',
      text: "Hi! I'm GlutenConvert, your AI recipe assistant. I can help you create gluten-free recipes, convert existing recipes, scan ingredients for safety, or answer any gluten-free cooking questions. What would you like to do today?",
      isUser: false,
      timestamp: new Date(),
    };
    
    console.log('🗑️ EXPLICIT USER ACTION: Clearing chat history');
    
    // Clear both user-specific and general storage
    if (user) {
      const userStorageKey = `${CHAT_STORAGE_KEY}_${user.id}`;
      localStorage.removeItem(userStorageKey);
      console.log('🗑️ Cleared user-specific storage:', userStorageKey);
    }
    localStorage.removeItem(CHAT_STORAGE_KEY);
    console.log('🗑️ Cleared general storage:', CHAT_STORAGE_KEY);
    
    setMessages([welcomeMessage]);
    console.log('✅ Chat reset complete - only welcome message remains');
  };

  return {
    messages,
    setMessages,
    addMessage,
    clearChatHistory
  };
};
