
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ChatMode = 'general' | 'recipe-creator' | 'conversion' | 'nutrition';

interface ChatContextType {
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
  contextData: any;
  setContextData: (data: any) => void;
  servingSize: number | null;
  setServingSize: (size: number | null) => void;
  isAwaitingServingSize: boolean;
  setIsAwaitingServingSize: (awaiting: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatMode, setChatMode] = useState<ChatMode>('general');
  const [contextData, setContextData] = useState<any>(null);
  const [servingSize, setServingSize] = useState<number | null>(null);
  const [isAwaitingServingSize, setIsAwaitingServingSize] = useState(false);

  return (
    <ChatContext.Provider value={{
      chatMode,
      setChatMode,
      contextData,
      setContextData,
      servingSize,
      setServingSize,
      isAwaitingServingSize,
      setIsAwaitingServingSize,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
