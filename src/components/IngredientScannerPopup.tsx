import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";
import ingredientScannerImage from "@/assets/ingredient-scanner-mobile.jpg";

interface IngredientScannerPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IngredientScannerPopup = ({ isOpen, onClose }: IngredientScannerPopupProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-background to-secondary/20 border-primary/20">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-0 top-0 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 justify-center mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Our Most Popular Feature
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          {/* Mobile UI Preview */}
          <div className="relative mx-auto max-w-[300px]">
            {imageError ? (
              <div className="w-full h-[500px] bg-muted/50 rounded-lg shadow-2xl flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                <div className="text-center space-y-2">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Ingredient Scanner Interface</p>
                </div>
              </div>
            ) : (
              <img 
                src={ingredientScannerImage} 
                alt="Ingredient Scanner Mobile Interface"
                className="w-full h-auto rounded-lg shadow-2xl"
                onError={handleImageError}
              />
            )}
          </div>

          {/* Instructions */}
          <div className="text-center space-y-3">
            <h4 className="font-semibold text-foreground">How to Use:</h4>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                1. Open the app on your mobile device
              </p>
              <p className="text-sm text-muted-foreground">
                2. Click the <span className="font-semibold text-red-500">red "Scan Ingredient"</span> button
              </p>
              <p className="text-sm text-muted-foreground">
                3. Point your camera at any ingredient label
              </p>
              <p className="text-sm text-muted-foreground">
                4. Get instant gluten-free analysis!
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-3">
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};