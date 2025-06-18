
import { Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  mode?: string;
  image?: string;
  convertedRecipe?: string;
}

interface ChatMessageProps {
  message: Message;
  onViewRecipe?: () => void;
}

const ChatMessage = ({ message, onViewRecipe }: ChatMessageProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          max-w-[80%] rounded-lg px-4 py-3 message-bubble
          ${message.isUser 
            ? 'bg-gluten-primary text-white ml-4' 
            : 'bg-card/50 text-foreground mr-4'
          }
        `}
      >
        {/* Mode indicator for AI messages */}
        {!message.isUser && message.mode && message.mode !== 'general' && (
          <div className="text-xs opacity-70 mb-2 capitalize">
            {message.mode.replace('-', ' ')} Mode
          </div>
        )}
        
        {/* Image display */}
        {message.image && (
          <div className="mb-3">
            <img 
              src={message.image} 
              alt="Uploaded content" 
              className="max-w-full h-auto rounded-lg border border-border/20"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}
        
        {/* Message text */}
        <div className="whitespace-pre-wrap leading-relaxed">
          {message.text}
        </div>
        
        {/* Converted recipe view button */}
        {message.convertedRecipe && onViewRecipe && (
          <div className="mt-3 pt-3 border-t border-border/20">
            <Button
              onClick={onViewRecipe}
              variant="outline"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Recipe
            </Button>
          </div>
        )}
        
        {/* Timestamp */}
        <div className={`flex items-center gap-1 mt-2 text-xs opacity-70`}>
          <Clock className="w-3 h-3" />
          <span>{formatTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
