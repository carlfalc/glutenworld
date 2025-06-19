
import { useState } from 'react';
import { Camera, Sparkles, Shield, ChefHat, X, Zap, Scan } from 'lucide-react';
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Instant AI Conversion</h2>
              <div className="inline-block bg-gluten-primary text-white px-6 py-2 rounded-full text-sm font-medium mb-4">
                Save hours of research
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Convert any recipe to gluten-free AND scan ingredient labels for precise gluten information - all powered by advanced AI technology
              </p>
            </div>

            {/* Two Main Features */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Recipe Conversion */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gluten-primary/10 rounded-full mr-4">
                    <ChefHat className="w-6 h-6 text-gluten-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Recipe Conversion</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Transform any traditional recipe into a safe, delicious gluten-free version with intelligent ingredient substitutions.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
                      <Camera className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-600">Scan Recipe</p>
                  </div>
                  <div className="p-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-2">
                      <Sparkles className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600">AI Analysis</p>
                  </div>
                  <div className="p-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-xs text-gray-600">Safe Recipe</p>
                  </div>
                </div>
              </div>

              {/* Ingredient Scanning */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mr-4">
                    <Scan className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Label Scanning</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Instantly scan product labels to get precise gluten information and make informed purchasing decisions with confidence.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mb-2">
                      <Camera className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-xs text-gray-600">Scan Label</p>
                  </div>
                  <div className="p-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full mb-2">
                      <Sparkles className="w-5 h-5 text-yellow-600" />
                    </div>
                    <p className="text-xs text-gray-600">AI Detection</p>
                  </div>
                  <div className="p-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600">Safety Report</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <ChefHat className="w-6 h-6 text-gluten-primary mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">What You'll Get</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recipe Conversion:</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
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
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Label Scanning:</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Instant gluten detection in ingredient lists</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Hidden gluten source identification and warnings</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Clear safety rating with detailed explanations</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Alternative product suggestions when needed</span>
                    </li>
                  </ul>
                </div>
              </div>
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
