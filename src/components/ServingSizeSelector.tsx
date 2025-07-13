
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, User, UserPlus, Coffee } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';
import { usePersistentChat } from '@/hooks/usePersistentChat';

const ServingSizeSelector = () => {
  const { setServingSize, setIsAwaitingServingSize } = useChatContext();
  const { addMessage } = usePersistentChat();
  const [customSize, setCustomSize] = useState('');

  const handleServingSelection = (size: number) => {
    setServingSize(size);
    setIsAwaitingServingSize(false);
    
    // Add follow-up message from AI after serving size is selected
    const followUpMessage = {
      id: `followup-${Date.now()}`,
      text: "Recipe Creator mode activated! I'll help you create amazing Gluten Free recipes, thanks for the serving size you have selected. Now tell me what recipe would you like?",
      isUser: false,
      timestamp: new Date(),
      mode: 'recipe-creator',
    };
    
    // Add the message after a short delay for better UX
    setTimeout(() => {
      addMessage(followUpMessage);
    }, 500);
  };

  const handleCustomSize = () => {
    const size = parseInt(customSize);
    if (size > 0) {
      handleServingSelection(size);
    }
  };

  const presetSizes = [
    { size: 1, icon: <User className="w-4 h-4" />, label: "Just me" },
    { size: 2, icon: <Users className="w-4 h-4" />, label: "Couple" },
    { size: 4, icon: <UserPlus className="w-4 h-4" />, label: "Family" },
    { size: 6, icon: <Coffee className="w-4 h-4" />, label: "Gathering" }
  ];

  return (
    <div className="space-y-4 p-4 bg-card/50 rounded-lg border border-border/30">
      <div className="text-center">
        <h3 className="font-semibold text-lg text-gluten-primary mb-2">
          How many servings do you need?
        </h3>
        <p className="text-sm text-muted-foreground">
          This helps me create the perfect recipe for you
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {presetSizes.map((preset) => (
          <Button
            key={preset.size}
            onClick={() => handleServingSelection(preset.size)}
            variant="outline"
            className="flex flex-col items-center gap-2 h-16 border-gluten-primary/20 hover:bg-gluten-primary/10"
          >
            {preset.icon}
            <span className="text-xs">{preset.label}</span>
            <span className="text-xs font-semibold">{preset.size} serving{preset.size > 1 ? 's' : ''}</span>
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          type="number"
          min="1"
          max="20"
          placeholder="Custom amount"
          value={customSize}
          onChange={(e) => setCustomSize(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={handleCustomSize}
          disabled={!customSize || parseInt(customSize) <= 0}
          className="bg-gluten-primary hover:bg-gluten-secondary text-white"
        >
          Set
        </Button>
      </div>
    </div>
  );
};

export default ServingSizeSelector;
