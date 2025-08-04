
import { Clock, Eye, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import IngredientAnalysis from './IngredientAnalysis';
import RecipeActions from './RecipeActions';
import MobileRecipeActions from './MobileRecipeActions';
import { useIsMobile } from '@/hooks/use-mobile';
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
  onViewRecipe?: () => void;
}

const ChatMessage = ({ message, onViewRecipe }: ChatMessageProps) => {
  const isMobile = useIsMobile();
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Debug log for image display
  console.log(`Message ${message.id} - Has image:`, !!message.image, 'Image length:', message.image?.length || 0);

  // Helper function to detect if a message contains a generated recipe
  const isGeneratedRecipe = (text: string, mode?: string): boolean => {
    // Check if it's from recipe-creator mode
    if (mode === 'recipe-creator') return true;
    
    // Check for recipe-like content patterns
    const recipePatterns = [
      /\*\*INGREDIENTS:\*\*/i,
      /\*\*INSTRUCTIONS:\*\*/i,
      /\*\*GLUTEN-FREE/i,
      /\*\*SERVING INFORMATION:\*\*/i,
      /Prep Time:/i,
      /Cook Time:/i,
      /Serves:/i,
      /Difficulty:/i
    ];
    
    return recipePatterns.some(pattern => pattern.test(text));
  };

  // Helper function to parse recipe data from message text
  const parseRecipeFromText = (text: string, messageId: string) => {
    // Extract recipe title
    const titleMatch = text.match(/^([^*\n]+)/);
    const title = titleMatch ? titleMatch[1].trim() : "Gluten-Free Recipe";
    
    // Extract serving information
    const servesMatch = text.match(/Serves:\s*(\d+)/i);
    const prepMatch = text.match(/Prep Time:\s*(\d+)/i);
    const cookMatch = text.match(/Cook Time:\s*(\d+)/i);
    
    return {
      id: messageId,
      title: title,
      converted_recipe: text,
      servings: servesMatch ? parseInt(servesMatch[1]) : undefined,
      prep_time: prepMatch ? parseInt(prepMatch[1]) : undefined,
      cook_time: cookMatch ? parseInt(cookMatch[1]) : undefined,
    };
  };

  // Enhanced recipe detection - check both convertedRecipe property and content patterns
  const shouldShowRecipeActions = !message.isUser && (
    !!message.convertedRecipe || isGeneratedRecipe(message.text, message.mode)
  );
  const recipeData = shouldShowRecipeActions ? parseRecipeFromText(
    message.convertedRecipe || message.text, 
    message.id
  ) : null;
  
  // Enhanced debug logging for recipe persistence
  console.log('ChatMessage Debug:', {
    messageId: message.id,
    isUser: message.isUser,
    mode: message.mode,
    hasConvertedRecipe: !!message.convertedRecipe,
    shouldShowRecipeActions,
    isMobile,
    hasRecipeData: !!recipeData,
    textLength: message.text.length,
    recipeDetectionMethod: message.convertedRecipe ? 'convertedRecipe property' : 'content pattern matching'
  });

  // Log successful recipe persistence detection
  if (shouldShowRecipeActions) {
    console.log('🍳 RECIPE DISPLAY: Recipe actions will be shown for message', message.id);
    if (message.convertedRecipe) {
      console.log('🍳 PERSISTENCE SUCCESS: Message has convertedRecipe property - recipe persisted correctly');
    }
  }

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
        
        {/* Recipe Actions for Generated Recipes */}
        {shouldShowRecipeActions && recipeData && (
          <div className="mt-3 pt-3 border-t border-border/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Recipe Actions</span>
            </div>
            {isMobile ? (
              <MobileRecipeActions recipe={recipeData} />
            ) : (
              <RecipeActions recipe={recipeData} size="sm" />
            )}
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
