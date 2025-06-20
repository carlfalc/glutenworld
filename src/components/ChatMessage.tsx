
import { Clock, Eye, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import IngredientAnalysis from './IngredientAnalysis';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  mode?: string;
  image?: string;
  convertedRecipe?: string;
  ingredientAnalysis?: {
    productName: string;
    analysis: string;
    safetyRating?: string;
    allergenWarnings?: string[];
    glutenStatus?: string;
    dairyStatus?: string;
    veganStatus?: string;
    productCategory?: string;
    productDescription?: string;
    productImageUrl?: string;
  };
}

interface ChatMessageProps {
  message: Message;
  onViewRecipe?: () => void;
}

const ChatMessage = ({ message, onViewRecipe }: ChatMessageProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Debug log for image display
  console.log(`Message ${message.id} - Has image:`, !!message.image, 'Image length:', message.image?.length || 0);

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
        
        {/* Image display with enhanced debugging and error handling */}
        {message.image && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
              <ImageIcon className="w-3 h-3" />
              <span>Image attached</span>
            </div>
            <div className="relative">
              <img 
                src={message.image} 
                alt="Uploaded content" 
                className="max-w-full h-auto rounded-lg border border-border/20 shadow-sm"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
                loading="lazy"
                onLoad={() => console.log(`Image loaded successfully for message ${message.id}`)}
                onError={(e) => {
                  console.error(`Image failed to load for message ${message.id}:`, e);
                  console.error('Image src:', message.image?.substring(0, 100) + '...');
                }}
              />
              {/* Image overlay with size info for debugging */}
              <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                {Math.round((message.image.length * 3/4) / 1024)}KB
              </div>
            </div>
          </div>
        )}
        
        {/* Message text */}
        <div className="whitespace-pre-wrap leading-relaxed">
          {message.text}
        </div>
        
        {/* Ingredient Analysis Display */}
        {message.ingredientAnalysis && (
          <div className="mt-3 pt-3 border-t border-border/20">
            <IngredientAnalysis {...message.ingredientAnalysis} />
          </div>
        )}
        
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
