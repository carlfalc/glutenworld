
import { User, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className={`flex gap-3 animate-fade-in ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        message.isUser 
          ? 'bg-gluten-primary text-white' 
          : 'bg-gradient-to-br from-gluten-primary to-gluten-secondary text-white'
      }`}>
        {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      
      <div className={`max-w-[80%] ${message.isUser ? 'text-right' : 'text-left'}`}>
        <div className={`message-bubble rounded-2xl px-4 py-3 ${
          message.isUser 
            ? 'bg-gluten-primary text-white rounded-tr-md' 
            : 'bg-card/50 text-foreground rounded-tl-md border border-border/30'
        }`}>
          {message.image && (
            <img 
              src={message.image} 
              alt="Shared image" 
              className="w-full max-w-xs rounded-lg mb-2"
            />
          )}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
