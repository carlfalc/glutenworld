
import React from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatContext } from '@/contexts/ChatContext';

interface MobileActionBarProps {
  onCameraClick: () => void;
  onIngredientScanClick: () => void;
}

const MobileActionBar = ({ onCameraClick, onIngredientScanClick }: MobileActionBarProps) => {
  const { setChatMode, setIsAwaitingServingSize } = useChatContext();

  const handleRecipeCreator = () => {
    setChatMode('recipe-creator');
    setIsAwaitingServingSize(true);
  };

  const handleConversion = () => {
    setChatMode('conversion');
  };

  const handleIngredientScan = () => {
    setChatMode('ingredient-scan');
    onIngredientScanClick();
  };

  const actions = [
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
      color: "bg-gluten-primary hover:bg-gluten-secondary"
    },
    {
      icon: <span className="text-lg">🔄</span>,
      label: "Convert Recipe",
      onClick: handleConversion,
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: <span className="text-lg">🥗</span>,
      label: "Nutrition",
      onClick: () => setChatMode('nutrition'),
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  return (
    <div className="bg-card/30 backdrop-blur-md border-t border-border/50">
      {/* Main action buttons in 2x2 grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {actions.map((action, index) => (
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
      
      {/* Check ingredient button - full width at bottom */}
      <div className="px-4 pb-4">
        <Button
          onClick={handleIngredientScan}
          className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 h-12 text-sm font-medium"
        >
          <span className="text-lg">📷</span>
          Check ingredient
        </Button>
      </div>
    </div>
  );
};

export default MobileActionBar;
