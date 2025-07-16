import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, X, ChevronDown } from 'lucide-react';
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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [modeMessageSent, setModeMessageSent] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { 
    chatMode, 
    setChatMode, 
    isAwaitingServingSize, 
    setIsAwaitingServingSize,
    servingSize,
    setServingSize
  } = useChatContext();

  const contextualAI = useContextualAI();
  const recipeConversion = useRecipeConversion();

  console.log('🔴 ChatInterface render - chatMode:', chatMode, 'modeMessageSent:', modeMessageSent);
  console.log('🔴 ChatInterface render - isAwaitingServingSize:', isAwaitingServingSize, 'servingSize:', servingSize);
  console.log('🔴 Messages count:', messages.length);

  // Voice recognition setup
  const voiceRecognition = useVoiceRecognition({
    onTranscript: (text) => {
      setInputValue(text);
    },
    onError: (error) => {
      console.error('Voice recognition error:', error);
    }
  });

  // Check if user is near bottom of chat
  const checkScrollPosition = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const threshold = 100;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const nearBottom = distanceFromBottom <= threshold;
    
    setIsNearBottom(nearBottom);
    setShowScrollButton(!nearBottom && messages.length > 3);
  };

  // Smart scroll to bottom - only if user is near bottom
  const scrollToBottom = (force = false) => {
    if (force || isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Force scroll to bottom (for button click)
  const forceScrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  // Handle scroll events
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      checkScrollPosition();
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages.length]);

  // Only auto-scroll when messages change if user is near bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial scroll position check
  useEffect(() => {
    checkScrollPosition();
  }, []);

  // Add mode indicator message when mode changes
  useEffect(() => {
    console.log('🎯 ChatInterface: Mode change effect triggered - chatMode:', chatMode, 'modeMessageSent:', modeMessageSent);
    
    if (chatMode !== 'general' && modeMessageSent !== chatMode) {
      console.log('🎯 ChatInterface: Adding mode indicator message for:', chatMode);
      
      const modeMessages = {
        'recipe-creator': "🍳 I'm ready to create a custom gluten-free recipe for you! Please tell me:\n\n1. How many servings do you need?\n2. What type of recipe would you like? (e.g., pasta dish, soup, dessert, etc.)\n\nJust describe what you're looking for and I'll create a delicious recipe for you!",
        'conversion': "🔄 Recipe Conversion Mode! Share a recipe and I'll convert it to be gluten-free.",
        'nutrition': "🥗 Nutrition Mode! Ask me about the nutritional aspects of gluten-free ingredients and dishes.",
        'ingredient-scan': "📷 Ingredient Scan Mode! Take a photo of any ingredient label and I'll analyze it for gluten, allergens, and provide detailed nutritional information."
      };

      const modeMessage: Message = {
        id: `mode-${chatMode}-${Date.now()}`,
        text: modeMessages[chatMode],
        isUser: false,
        timestamp: new Date(),
        mode: chatMode,
      };

      console.log('🎯 ChatInterface: Adding mode message:', modeMessages[chatMode]);
      addMessage(modeMessage);
      setModeMessageSent(chatMode);
    } else {
      console.log('🎯 ChatInterface: Mode change effect - NOT adding message. Conditions not met.');
    }
  }, [chatMode, addMessage]);

  // Reset mode message tracking when mode changes to general OR when serving size is set for recipe-creator
  useEffect(() => {
    if (chatMode === 'general') {
      console.log('Resetting mode message tracking - switched to general mode');
      setModeMessageSent(null);
    } else if (chatMode === 'recipe-creator' && servingSize && !isAwaitingServingSize) {
      // Reset the mode message sent flag when serving size is completed to prevent re-showing
      console.log('Recipe creator serving size completed - preventing mode message re-trigger');
      setModeMessageSent('recipe-creator');
    }
  }, [chatMode, servingSize, isAwaitingServingSize]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      mode: chatMode,
    };

    console.log('Adding user message:', userMessage);
    addMessage(userMessage);
    const currentInput = inputValue;
    setInputValue('');

    try {
      // If user is in recipe-creator mode, acknowledge their request
      if (chatMode === 'recipe-creator') {
        const acknowledgmentMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Perfect! Let me create that delicious gluten-free recipe for you. I'll be right back with something amazing! 🍳✨",
          isUser: false,
          timestamp: new Date(),
          mode: chatMode,
        };
        addMessage(acknowledgmentMessage);
        
        // Small delay before generating the recipe for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const response = await contextualAI.mutateAsync({ 
        message: currentInput,
        context: { chatMode }
      });

      const aiResponse: Message = {
        id: (Date.now() + 2).toString(),
        text: response.response || "I'm sorry, I couldn't process that request. Please try again.",
        isUser: false,
        timestamp: new Date(),
        mode: chatMode,
      };

      console.log('Adding AI response:', aiResponse);
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
    console.log('Parsing ingredient analysis from text:', text.substring(0, 200) + '...');
    
    const lines = text.split('\n');
    let analysis: any = null;
    
    if (text.includes('Product:') || text.includes('Safety Rating:') || text.includes('Gluten Status:') || 
        text.includes('PRODUCT IDENTIFICATION:') || text.includes('GLUTEN STATUS:') || text.includes('INGREDIENT ANALYSIS')) {
      
      analysis = {
        productName: extractValue(text, 'Product Name:') || extractValue(text, 'Product:') || 'Unknown Product',
        analysis: text,
        safetyRating: extractValue(text, 'Safety Rating:') || extractValue(text, 'Celiac Safety Level:'),
        glutenStatus: extractValue(text, 'Gluten Status:') || extractValue(text, 'GLUTEN STATUS:'),
        dairyStatus: extractValue(text, 'Dairy Status:') || extractValue(text, 'DAIRY STATUS:'),
        veganStatus: extractValue(text, 'Vegan Status:') || extractValue(text, 'VEGAN STATUS:'),
        allergenWarnings: extractAllergens(text),
        productCategory: extractValue(text, 'Product Type:') || extractValue(text, 'Category:'),
        productDescription: extractValue(text, 'Brand:'),
      };
      
      console.log('Parsed ingredient analysis:', analysis);
    } else {
      console.log('No structured ingredient analysis found in response');
    }
    
    return analysis;
  };

  const extractValue = (text: string, key: string): string | undefined => {
    const regex = new RegExp(`${key}\\s*([^\\n]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim().replace(/^[•\-\*]\s*/, '') : undefined;
  };

  const extractAllergens = (text: string): string[] => {
    const allergenMatch = text.match(/(?:Allergens?|Contains|May Contain)[:\s]+([^\n]+)/i);
    if (allergenMatch) {
      return allergenMatch[1].split(',').map(a => a.trim()).filter(a => a);
    }
    return [];
  };

  const handleRecipeImageCapture = async (imageBase64: string, source: 'camera' | 'upload' | 'screenshot') => {
    console.log('Recipe image captured:', source, 'Image size:', imageBase64.length);
    
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
      mode: chatMode,
    };
    
    console.log('Adding recipe image message with image data:', !!userMessage.image);
    addMessage(userMessage);
    setShowRecipeCapture(false);

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
    console.log('Ingredient image captured:', source, 'Image size:', imageBase64.length);
    
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
      mode: chatMode,
    };
    
    console.log('Adding ingredient image message with image data:', !!userMessage.image);
    addMessage(userMessage);
    setShowIngredientCapture(false);

    const aiAcknowledgment: Message = {
      id: (Date.now() + 1).toString(),
      text: "Thanks for the ingredient photo, let me analyze this for you! 🔍",
      isUser: false,
      timestamp: new Date(),
    };
    addMessage(aiAcknowledgment);

    try {
      console.log('Sending ingredient analysis request to AI...');
      const response = await contextualAI.mutateAsync({ 
        message: `Please analyze this ingredient label image: ${imageBase64}`,
        context: { servingSize, chatMode: 'ingredient-scan' }
      });

      console.log('Received AI response for ingredient analysis:', response.response?.substring(0, 200) + '...');

      const analysisData = parseIngredientAnalysis(response.response || '');
      
      const aiResponse: Message = {
        id: (Date.now() + 2).toString(),
        text: response.response || "I couldn't analyze this ingredient label. Please try again with a clearer image.",
        isUser: false,
        timestamp: new Date(),
        mode: 'ingredient-scan',
        ingredientAnalysis: analysisData,
      };

      console.log('Adding AI response with ingredient analysis:', !!analysisData);
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
    console.log('🔄 ChatInterface: Resetting chat - clearing mode and messages');
    setChatMode('general');
    setServingSize(null); // Reset serving size when resetting chat
    setIsAwaitingServingSize(false);
    setConversionResult(null);
    setActiveConvertedRecipeId(null);
    setModeMessageSent(null);
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
      <div 
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto p-4 space-y-4 relative ${isMobile ? 'chat-messages-container' : ''}`}
      >
        {messages.map((message) => {
          console.log('Rendering message:', message.id, 'Has image:', !!message.image);
          return (
            <ChatMessage 
              key={message.id} 
              message={message}
              onViewRecipe={message.convertedRecipe ? () => {
                setConversionResult(message.convertedRecipe!);
                setActiveConvertedRecipeId(message.id);
              } : undefined}
            />
          );
        })}
        
        
        <div ref={messagesEndRef} />

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <div className="fixed bottom-20 right-6 z-10">
            <Button
              onClick={forceScrollToBottom}
              size="sm"
              className="rounded-full bg-gluten-primary hover:bg-gluten-secondary text-white shadow-lg"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}
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
