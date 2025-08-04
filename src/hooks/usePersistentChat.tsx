
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/types/chat';

const CHAT_STORAGE_KEY = 'gluten_convert_chat_history';

// Helper function to safely serialize complex objects
const safeStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj, (key, value) => {
      // Preserve Date objects and ingredient analysis data
      if (value instanceof Date) {
        return { _type: 'Date', value: value.toISOString() };
      }
      if (key === 'ingredientAnalysis' && value) {
        console.log('📊 Serializing ingredientAnalysis for message:', value);
        return value;
      }
      return value;
    });
  } catch (error) {
    console.error('❌ Serialization error:', error);
    throw error;
  }
};

// Helper function to safely parse complex objects
const safeParse = (str: string): any => {
  try {
    return JSON.parse(str, (key, value) => {
      // Restore Date objects
      if (value && typeof value === 'object' && value._type === 'Date') {
        return new Date(value.value);
      }
      if (key === 'ingredientAnalysis' && value) {
        console.log('📊 Restored ingredientAnalysis:', value);
        return value;
      }
      return value;
    });
  } catch (error) {
    console.error('❌ Parse error:', error);
    throw error;
  }
};

export const usePersistentChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  console.log('🔥 usePersistentChat HOOK CALLED - messages length:', messages.length);

  // Load messages from localStorage when component mounts or user changes
  useEffect(() => {
    const loadMessages = () => {
      console.log('🔍 Loading messages from localStorage...');
      let storageKey = CHAT_STORAGE_KEY;
      
      if (user) {
        storageKey = `${CHAT_STORAGE_KEY}_${user.id}`;
      }
      
      try {
        const storedMessages = localStorage.getItem(storageKey);
        
        if (storedMessages) {
          console.log('📦 Raw storage data length:', storedMessages.length);
          const parsedMessages = safeParse(storedMessages);
          
          // Validate and restore message structure
          const validatedMessages: Message[] = parsedMessages.map((msg: any, index: number) => {
            const validatedMsg: Message = {
              id: msg.id || `msg-${index}`,
              text: msg.text || '',
              isUser: Boolean(msg.isUser),
              timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp || Date.now()),
            };
            
            // Preserve optional properties with validation
            if (msg.mode) validatedMsg.mode = msg.mode;
            if (msg.image) validatedMsg.image = msg.image;
            if (msg.convertedRecipe) validatedMsg.convertedRecipe = msg.convertedRecipe;
            
            // Special handling for ingredientAnalysis
            if (msg.ingredientAnalysis) {
              console.log('🔍 Found ingredientAnalysis in message:', msg.id, msg.ingredientAnalysis);
              validatedMsg.ingredientAnalysis = {
                productName: msg.ingredientAnalysis.productName || '',
                analysis: msg.ingredientAnalysis.analysis || '',
                safetyRating: msg.ingredientAnalysis.safetyRating,
                allergenWarnings: Array.isArray(msg.ingredientAnalysis.allergenWarnings) 
                  ? msg.ingredientAnalysis.allergenWarnings 
                  : [],
                glutenStatus: msg.ingredientAnalysis.glutenStatus,
                dairyStatus: msg.ingredientAnalysis.dairyStatus,
                veganStatus: msg.ingredientAnalysis.veganStatus,
                productCategory: msg.ingredientAnalysis.productCategory,
                productDescription: msg.ingredientAnalysis.productDescription,
                productImageUrl: msg.ingredientAnalysis.productImageUrl,
              };
              console.log('✅ Validated ingredientAnalysis for message:', validatedMsg.id);
            }
            
            return validatedMsg;
          });
          
          // Filter out duplicate mode messages
          const filteredMessages = validatedMessages.filter((msg, index) => {
            if (!msg.mode || msg.isUser) return true;
            
            const firstModeIndex = validatedMessages.findIndex((m) => 
              m.mode === msg.mode && 
              !m.isUser && 
              m.text.includes('Mode') && 
              (m.text.includes('Activated') || m.text.includes('Mode!'))
            );
            
            return index === firstModeIndex;
          });
          
          console.log('🔄 Loaded messages:', {
            parsed: parsedMessages.length,
            validated: validatedMessages.length,
            filtered: filteredMessages.length,
            withIngredientAnalysis: filteredMessages.filter(m => m.ingredientAnalysis).length
          });
          
          if (filteredMessages.length > 0) {
            setMessages(filteredMessages);
            console.log('✅ Messages restored successfully');
            return;
          }
        }
        
        // Fallback: create welcome message
        console.log('📭 No valid stored messages, creating welcome message');
        const welcomeMessage: Message = {
          id: '1',
          text: "Hi! I'm GlutenConvert, your AI recipe assistant. I can help you create gluten-free recipes, convert existing recipes, scan ingredients for safety, or answer any gluten-free cooking questions. What would you like to do today?",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        
      } catch (error) {
        console.error('❌ Failed to load messages:', error);
        
        // Fallback recovery: try to load partial data
        try {
          const storedMessages = localStorage.getItem(storageKey);
          if (storedMessages) {
            const rawData = JSON.parse(storedMessages);
            const recoveredMessages: Message[] = Array.isArray(rawData) 
              ? rawData.filter(msg => msg && msg.id && msg.text).map((msg, index) => ({
                  id: msg.id || `recovered-${index}`,
                  text: msg.text || 'Message could not be recovered',
                  isUser: Boolean(msg.isUser),
                  timestamp: new Date(),
                  ...(msg.ingredientAnalysis && { ingredientAnalysis: msg.ingredientAnalysis })
                }))
              : [];
            
            if (recoveredMessages.length > 0) {
              console.log('🔧 Partial recovery successful:', recoveredMessages.length, 'messages');
              setMessages(recoveredMessages);
              return;
            }
          }
        } catch (recoveryError) {
          console.error('❌ Recovery also failed:', recoveryError);
        }
        
        // Final fallback
        const welcomeMessage: Message = {
          id: '1',
          text: "Hi! I'm GlutenConvert, your AI recipe assistant. I can help you create gluten-free recipes, convert existing recipes, scan ingredients for safety, or answer any gluten-free cooking questions. What would you like to do today?",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    };

    loadMessages();
  }, [user?.id]); // Only depend on user ID to prevent unnecessary reloads

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length === 0) return;
    
    let storageKey = CHAT_STORAGE_KEY;
    if (user) {
      storageKey = `${CHAT_STORAGE_KEY}_${user.id}`;
    }
    
    // Filter out duplicate mode messages before saving
    const messagesToSave = messages.filter((msg, index) => {
      if (!msg.mode || msg.isUser) return true;
      
      const firstModeIndex = messages.findIndex((m) => 
        m.mode === msg.mode && 
        !m.isUser && 
        m.text.includes('Mode') && 
        (m.text.includes('Activated') || m.text.includes('Mode!'))
      );
      
      return index === firstModeIndex;
    });
    
    const stats = {
      total: messagesToSave.length,
      withImages: messagesToSave.filter(msg => msg.image).length,
      withIngredientAnalysis: messagesToSave.filter(msg => msg.ingredientAnalysis).length,
      withRecipes: messagesToSave.filter(msg => msg.convertedRecipe).length
    };
    
    console.log(`💾 Saving ${stats.total} messages:`, stats);
    
    // Log ingredient analysis data specifically
    messagesToSave.forEach(msg => {
      if (msg.ingredientAnalysis) {
        console.log(`📊 Saving ingredientAnalysis in message ${msg.id}:`, {
          productName: msg.ingredientAnalysis.productName,
          hasAnalysis: !!msg.ingredientAnalysis.analysis,
          safetyRating: msg.ingredientAnalysis.safetyRating
        });
      }
    });
    
    try {
      const serializedData = safeStringify(messagesToSave);
      localStorage.setItem(storageKey, serializedData);
      console.log('✅ Messages saved successfully to:', storageKey);
    } catch (error) {
      console.error('❌ Save failed:', error);
      
      // Fallback: save without images but preserve ingredientAnalysis
      try {
        const fallbackMessages = messagesToSave.map(msg => ({
          ...msg,
          image: undefined // Remove images but keep everything else
        }));
        
        const fallbackData = safeStringify(fallbackMessages);
        localStorage.setItem(storageKey, fallbackData);
        console.log('✅ Fallback save successful (without images)');
      } catch (fallbackError) {
        console.error('❌ Fallback save also failed:', fallbackError);
        
        // Emergency fallback: save minimal data
        try {
          const minimalMessages = messagesToSave.map(msg => ({
            id: msg.id,
            text: msg.text,
            isUser: msg.isUser,
            timestamp: msg.timestamp,
            ...(msg.ingredientAnalysis && { ingredientAnalysis: msg.ingredientAnalysis })
          }));
          
          localStorage.setItem(storageKey, JSON.stringify(minimalMessages));
          console.log('🚨 Emergency save successful (minimal data only)');
        } catch (emergencyError) {
          console.error('🚨 Complete save failure:', emergencyError);
        }
      }
    }
  }, [messages, user?.id]);

  const addMessage = (message: Message) => {
    console.log('📝 Adding message:', {
      id: message.id,
      textPreview: message.text.substring(0, 50) + '...',
      hasImage: !!message.image,
      hasIngredientAnalysis: !!message.ingredientAnalysis,
      hasConvertedRecipe: !!message.convertedRecipe,
      mode: message.mode
    });
    
    // Enhanced logging for recipe persistence
    if (message.convertedRecipe) {
      console.log('🍳 RECIPE PERSISTENCE: Message contains convertedRecipe property - will persist in chat history');
      console.log('🍳 Recipe text preview:', message.convertedRecipe.substring(0, 100) + '...');
    }
    
    // Log ingredient analysis data specifically
    if (message.ingredientAnalysis) {
      console.log('📊 New message contains ingredientAnalysis:', {
        productName: message.ingredientAnalysis.productName,
        safetyRating: message.ingredientAnalysis.safetyRating,
        glutenStatus: message.ingredientAnalysis.glutenStatus
      });
    }
    
    // Prevent adding duplicate mode messages
    if (message.mode && !message.isUser && message.text.includes('Mode')) {
      const existingModeMessage = messages.find(m => 
        m.mode === message.mode && 
        !m.isUser && 
        m.text.includes('Mode') && 
        (m.text.includes('Activated') || m.text.includes('Mode!'))
      );
      
      if (existingModeMessage) {
        console.log('🚫 Preventing duplicate mode message for:', message.mode);
        return;
      }
    }
    
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
