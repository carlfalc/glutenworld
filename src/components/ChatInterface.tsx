
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from './ChatMessage';
import MobileActionBar from './MobileActionBar';
import ServingSizeSelector from './ServingSizeSelector';
import ImageCapture from './ImageCapture';
import RecipeConversionResult from './RecipeConversionResult';
import { useChatContext } from '@/contexts/ChatContext';
import { useContextualAI } from '@/hooks/useContextualAI';
import { useRecipeConversion } from '@/hooks/useRecipeConversion';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePersistentChat } from '@/hooks/usePersistentChat';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

const ChatInterface = () => {
  const { messages, setMessages, addMessage, clearChatHistory } = usePersistentChat();
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showRecipeCapture, setShowRecipeCapture] = useState(false);
  const [showIngredientCapture, setShowIngredientCapture] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);
  const [activeConvertedRecipeId, setActiveConvertedRecipeId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { 
    chatMode, 
    setChatMode, 
    isAwaitingServingSize, 
    setIsAwaitingServingSize,
    servingSize 
  } = useChatContext();

  const contextualAI = useContextualAI();
  const recipeConversion = useRecipeConversion();

  // Voice recognition setup
  const voiceRecognition = useVoiceRecognition({
    onTranscript: (text) => {
      setInputValue(text);
    },
    onError: (error) => {
      console.error('Voice recognition error:', error);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add mode indicator message when mode changes
  useEffect(() => {
    if (chatMode !== 'general') {
      const modeMessages = {
        'recipe-creator': "🍳 Recipe Creator Mode Activated! I'll help you create amazing gluten-free recipes. How many servings do you need?",
        'conversion': "🔄 Recipe Conversion Mode! Share a recipe and I'll convert it to be gluten-free.",
        'nutrition': "🥗 Nutrition Mode! Ask me about the nutritional aspects of gluten-free ingredients and dishes.",
        'ingredient-scan': "📷 Ingredient Scan Mode! Take a photo of any ingredient label and I'll analyze it for gluten, allergens, and provide detailed nutritional information."
      };

      const modeMessage: Message = {
        id: Date.now().toString(),
        text: modeMessages[chatMode],
        isUser: false,
        timestamp: new Date(),
        mode: chatMode,
      };

      addMessage(modeMessage);

      if (chatMode === 'recipe-creator') {
        setIsAwaitingServingSize(true);
      }
    }
  }, [chatMode, setIsAwaitingServingSize, addMessage]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      mode: chatMode,
    };

    addMessage(userMessage);
    const currentInput = inputValue;
    setInputValue('');

    try {
      const response = await contextualAI.mutateAsync({ 
        message: currentInput,
        context: { servingSize, chatMode }
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response || "I'm sorry, I couldn't process that request. Please try again.",
        isUser: false,
        timestamp: new Date(),
        mode: chatMode,
      };

      addMessage(aiResponse);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing some technical difficulties. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    }
  };

  const parseIngredientAnalysis = (text: string) => {
    // Try to parse structured ingredient analysis from AI response
    const lines = text.split('\n');
    let analysis: any = null;
    
    // Look for structured data patterns in the response
    if (text.includes('Product:') || text.includes('Safety Rating:') || text.includes('Gluten Status:')) {
      analysis = {
        productName: extractValue(text, 'Product:') || 'Unknown Product',
        analysis: text,
        safetyRating: extractValue(text, 'Safety Rating:'),
        glutenStatus: extractValue(text, 'Gluten Status:'),
        dairyStatus: extractValue(text, 'Dairy Status:'),
        veganStatus: extractValue(text, 'Vegan Status:'),
        allergenWarnings: extractAllergens(text),
      };
    }
    
    return analysis;
  };

  const extractValue = (text: string, key: string): string | undefined => {
    const regex = new RegExp(`${key}\\s*([^\\n]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : undefined;
  };

  const extractAllergens = (text: string): string[] => {
    const allergenMatch = text.match(/Allergens?[:\s]+([^\n]+)/i);
    if (allergenMatch) {
      return allergenMatch[1].split(',').map(a => a.trim()).filter(a => a);
    }
    return [];
  };

  const handleRecipeImageCapture = async (imageBase64: string, source: 'camera' | 'upload' | 'screenshot') => {
    // Create appropriate message based on source
    const sourceMessages = {
      camera: 'I took a photo of this recipe',
      upload: 'I uploaded this recipe image',
      screenshot: 'I captured a screenshot of this recipe'
    };

    const userMessage: Message = {
      id: Date.now().toString(),
      text: sourceMessages[source],
      isUser: true,
      timestamp: new Date(),
      image: imageBase64,
    };
    addMessage(userMessage);

    const aiAcknowledgment: Message = {
      id: (Date.now() + 1).toString(),
      text: "Thanks for the picture, I'll create some magic and recreate this with no gluten! 🪄✨",
      isUser: false,
      timestamp: new Date(),
    };
    addMessage(aiAcknowledgment);

    try {
      const response = await recipeConversion.mutateAsync({ 
        imageBase64,
        prompt: "Please analyze this recipe and convert it to be gluten-free following the detailed format guidelines."
      });

      const convertedRecipeMessageId = (Date.now() + 2).toString();
      
      const convertedRecipeMessage: Message = {
        id: convertedRecipeMessageId,
        text: "Here's your converted gluten-free recipe! 🎉",
        isUser: false,
        timestamp: new Date(),
        convertedRecipe: response.convertedRecipe,
      };
      
      addMessage(convertedRecipeMessage);
      setConversionResult(response.convertedRecipe);
      setActiveConvertedRecipeId(convertedRecipeMessageId);
      
    } catch (error) {
      console.error('Recipe conversion error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "I'm having trouble processing this recipe image. Please try again with a clearer photo.",
        isUser: false,
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    }
  };

  const handleIngredientImageCapture = async (imageBase64: string, source: 'camera' | 'upload' | 'screenshot') => {
    const sourceMessages = {
      camera: 'I took a photo of this ingredient label',
      upload: 'I uploaded this ingredient label image',
      screenshot: 'I captured a screenshot of this ingredient label'
    };

    const userMessage: Message = {
      id: Date.now().toString(),
      text: sourceMessages[source],
      isUser: true,
      timestamp: new Date(),
      image: imageBase64,
    };
    addMessage(userMessage);

    const aiAcknowledgment: Message = {
      id: (Date.now() + 1).toString(),
      text: "Thanks for the ingredient photo, let me analyze this for you! 🔍",
      isUser: false,
      timestamp: new Date(),
    };
    addMessage(aiAcknowledgment);

    try {
      const response = await contextualAI.mutateAsync({ 
        message: `Please analyze this ingredient label image: ${imageBase64}`,
        context: { servingSize, chatMode: 'ingredient-scan' }
      });

      const analysisData = parseIngredientAnalysis(response.response || '');
      
      const aiResponse: Message = {
        id: (Date.now() + 2).toString(),
        text: response.response || "I couldn't analyze this ingredient label. Please try again with a clearer image.",
        isUser: false,
        timestamp: new Date(),
        mode: 'ingredient-scan',
        ingredientAnalysis: analysisData,
      };

      addMessage(aiResponse);
    } catch (error) {
      console.error('Ingredient analysis error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "I'm experiencing some technical difficulties analyzing this ingredient. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setChatMode('general');
    setIsAwaitingServingSize(false);
    setConversionResult(null);
    setActiveConvertedRecipeId(null);
    clearChatHistory();
  };

  const handleBackFromRecipe = () => {
    setConversionResult(null);
    setActiveConvertedRecipeId(null);
  };

  const handleRecipeSaved = () => {
    setConversionResult(null);
    setActiveConvertedRecipeId(null);
  };

  if (conversionResult) {
    return (
      <RecipeConversionResult
        convertedRecipe={conversionResult}
        onBack={handleBackFromRecipe}
        onSave={handleRecipeSaved}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Mode Indicator */}
      {chatMode !== 'general' && (
        <div className="p-3 bg-gluten-primary/10 border-b border-gluten-primary/20 flex items-center justify-between">
          <span className="text-sm font-medium text-gluten-primary capitalize">
            {chatMode.replace('-', ' ')} Mode
          </span>
          <Button
            onClick={resetChat}
            variant="ghost"
            size="sm"
            className="text-gluten-primary hover:bg-gluten-primary/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isMobile ? 'chat-messages-container' : ''}`}>
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message}
            onViewRecipe={message.convertedRecipe ? () => {
              setConversionResult(message.convertedRecipe!);
              setActiveConvertedRecipeId(message.id);
            } : undefined}
          />
        ))}
        
        {/* Serving Size Selector */}
        {isAwaitingServingSize && chatMode === 'recipe-creator' && (
          <ServingSizeSelector />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Desktop */}
      {!isMobile && (
        <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-md">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me what you'd like to make or ask a gluten-free question..."
                className="bg-input/50 border-border/50 focus:border-gluten-primary focus:ring-gluten-primary/20"
                disabled={contextualAI.isPending || voiceRecognition.isProcessing}
              />
            </div>
            <Button
              onClick={voiceRecognition.toggleListening}
              variant="outline"
              size="icon"
              className={`border-border/50 hover:bg-accent/50 ${
                voiceRecognition.isListening ? 'bg-red-500 text-white animate-pulse' : 
                voiceRecognition.isProcessing ? 'bg-yellow-500 text-white' : ''
              }`}
              disabled={voiceRecognition.isProcessing}
            >
              {voiceRecognition.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button
              onClick={handleSendMessage}
              className="bg-gluten-primary hover:bg-gluten-secondary text-white"
              disabled={!inputValue.trim() || contextualAI.isPending || voiceRecognition.isProcessing}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Input Area */}
      {isMobile && (
        <>
          <div className="p-3 border-t border-border/50 bg-card/30 backdrop-blur-md flex-shrink-0">
            <div className="flex gap-2 items-center">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about gluten-free cooking..."
                className="flex-1 bg-input/50 border-border/50 focus:border-gluten-primary"
                disabled={contextualAI.isPending || voiceRecognition.isProcessing}
              />
              <Button
                onClick={voiceRecognition.toggleListening}
                variant="outline"
                size="sm"
                className={`border-border/50 hover:bg-accent/50 ${
                  voiceRecognition.isListening ? 'bg-red-500 text-white animate-pulse' : 
                  voiceRecognition.isProcessing ? 'bg-yellow-500 text-white' : ''
                }`}
                disabled={voiceRecognition.isProcessing}
              >
                {voiceRecognition.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-gluten-primary hover:bg-gluten-secondary text-white px-3"
                disabled={!inputValue.trim() || contextualAI.isPending || voiceRecognition.isProcessing}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <MobileActionBar 
            onCameraClick={() => setShowRecipeCapture(true)} 
            onIngredientScanClick={() => setShowIngredientCapture(true)}
          />
        </>
      )}

      {/* Recipe Image Capture Dialog */}
      <Dialog open={showRecipeCapture} onOpenChange={setShowRecipeCapture}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan/Upload Recipe</DialogTitle>
          </DialogHeader>
          <ImageCapture
            type="recipe"
            onImageCapture={handleRecipeImageCapture}
            onClose={() => setShowRecipeCapture(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Ingredient Image Capture Dialog */}
      <Dialog open={showIngredientCapture} onOpenChange={setShowIngredientCapture}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Check Ingredient</DialogTitle>
          </DialogHeader>
          <ImageCapture
            type="ingredient"
            onImageCapture={handleIngredientImageCapture}
            onClose={() => setShowIngredientCapture(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface;
