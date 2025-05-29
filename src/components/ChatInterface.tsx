
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm GlutenConvert, your AI recipe assistant. I can help you convert any recipe to be gluten-free or suggest delicious gluten-free alternatives. What would you like to make today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('pasta') || input.includes('spaghetti') || input.includes('noodles')) {
      return "Great choice! For gluten-free pasta dishes, I recommend using rice noodles, quinoa pasta, or chickpea pasta instead of wheat-based pasta. Would you like a specific recipe conversion or cooking tips?";
    }
    
    if (input.includes('bread') || input.includes('sandwich')) {
      return "Perfect! For gluten-free bread, you can use almond flour, rice flour, or a gluten-free flour blend. I can help you convert your favorite bread recipe or suggest some amazing gluten-free alternatives. What type of bread are you thinking of?";
    }
    
    if (input.includes('cake') || input.includes('dessert') || input.includes('cookies')) {
      return "Delicious! Gluten-free baking is my specialty. I can help you substitute regular flour with almond flour, coconut flour, or a gluten-free baking mix. What dessert would you like to make gluten-free?";
    }
    
    if (input.includes('pizza')) {
      return "Pizza is totally doable gluten-free! I can help you make a cauliflower crust, almond flour crust, or use a pre-made gluten-free pizza base. Would you like a full pizza recipe conversion?";
    }
    
    return "I'd love to help you with that! Could you share the recipe you'd like to convert, or tell me more about what you're trying to make? I can identify gluten-containing ingredients and provide perfect substitutes.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleMicrophone = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-md">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me what you'd like to make or share a recipe..."
              className="bg-input/50 border-border/50 focus:border-gluten-primary focus:ring-gluten-primary/20 text-foreground placeholder:text-muted-foreground pr-12"
            />
          </div>
          <Button
            onClick={toggleMicrophone}
            variant="outline"
            size="icon"
            className={`border-border/50 hover:bg-accent/50 ${isListening ? 'bg-gluten-primary text-white' : ''}`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button
            onClick={handleSendMessage}
            className="bg-gluten-primary hover:bg-gluten-secondary text-white"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
