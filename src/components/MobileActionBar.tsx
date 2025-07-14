
import React, { useState } from 'react';
import { Camera, X, Heart, Scan, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatContext } from '@/contexts/ChatContext';
import FavoritesModal from '@/components/FavoritesModal';

interface MobileActionBarProps {
  onCameraClick: () => void;
  onIngredientScanClick: () => void;
}

const MobileActionBar = ({ onCameraClick, onIngredientScanClick }: MobileActionBarProps) => {
  const { setChatMode, setIsAwaitingServingSize } = useChatContext();
  const [showFavorites, setShowFavorites] = useState(false);

  const handleRecipeCreator = () => {
    console.log('🟢 MobileActionBar: Recipe Creator button clicked');
    setChatMode('recipe-creator');
    console.log('🟢 MobileActionBar: Set chat mode to recipe-creator');
    // Don't set setIsAwaitingServingSize here - let ChatInterface handle it
  };

  const handleConversion = () => {
    setChatMode('conversion');
  };

  const handleIngredientScan = () => {
    setChatMode('ingredient-scan');
    onIngredientScanClick();
  };

  // Top row actions (2x2 grid)
  const topRowActions = [
    {
      icon: <Camera className="w-5 h-5" />,
      label: "Scan/Upload Recipe",
      onClick: onCameraClick,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: <span className="text-lg">🍳</span>,
      label: "Recipe Creator",
      onClick: handleRecipeCreator,
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: <span className="text-lg">🔄</span>,
      label: "Convert Recipe",
      onClick: handleConversion,
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "My Favorites",
      onClick: () => setShowFavorites(true),
      color: "bg-blue-600 hover:bg-blue-700"
    }
  ];

  return (
    <>
      <div className="bg-card/30 backdrop-blur-md border-t border-border/50">
        {/* Top row: 2x2 grid */}
        <div className="grid grid-cols-2 gap-3 p-4">
          {topRowActions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              className={`${action.color} text-white flex flex-col items-center gap-2 h-16 text-xs font-medium`}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>

        {/* Bottom row: Full width Check Ingredient button */}
        <div className="px-4 pb-4">
          <Button
            onClick={handleIngredientScan}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 h-16 w-full text-sm font-medium"
          >
            <Skull className="w-5 h-5 text-yellow-400" />
            <Scan className="w-5 h-5" />
            Check Ingredient
          </Button>
        </div>
      </div>

      <FavoritesModal 
        open={showFavorites} 
        onOpenChange={setShowFavorites}
      />
    </>
  );
};

export default MobileActionBar;
