
import { useState } from 'react';
import { Camera, Sparkles, Shield, ChefHat, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface FeatureDetailsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFromLanding?: boolean;
  onStartScanning?: () => void;
}

const FeatureDetailsPopup = ({ 
  open, 
  onOpenChange, 
  isFromLanding = false,
  onStartScanning 
}: FeatureDetailsPopupProps) => {
  const handleStartScanning = () => {
    if (isFromLanding && onStartScanning) {
      onStartScanning();
    } else {
      onOpenChange(false);
    }
  };

  const buttonText = isFromLanding ? 'Launch Now' : 'Start Scanning Recipes';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="p-8 bg-gradient-to-br from-gluten-primary/5 to-blue-50">
            {/* Hero Section - Matching Landing Page Design */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gluten-primary/10 rounded-full mb-6">
                <Zap className="w-10 h-10 text-gluten-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Instant AI Conversion</h2>
              <div className="inline-block bg-gluten-primary text-white px-6 py-2 rounded-full text-sm font-medium mb-4">
                Save hours of research
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Convert any recipe to gluten-free in seconds with our advanced AI technology
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Scan or Upload</h3>
                <p className="text-sm text-gray-600">
                  Simply take a photo of your recipe or upload an existing image from your device
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-600">
                  Our AI identifies gluten-containing ingredients and suggests safe alternatives
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Safe Recipe</h3>
                <p className="text-sm text-gray-600">
                  Get a complete gluten-free version with detailed substitutions and instructions
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <ChefHat className="w-6 h-6 text-gluten-primary mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">What You'll Get</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gluten-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Complete ingredient analysis highlighting gluten sources</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gluten-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Detailed gluten-free substitutions with exact measurements</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gluten-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Step-by-step cooking instructions for the converted recipe</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gluten-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Summary of all changes made to ensure safety</span>
                </li>
              </ul>
            </div>

            <div className="text-center mt-8">
              <Button 
                onClick={handleStartScanning} 
                className="bg-gluten-primary hover:bg-gluten-secondary px-8 py-3"
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureDetailsPopup;
