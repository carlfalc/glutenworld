import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChefHat, Sparkles, BookOpen, Users, Heart, ArrowRight } from 'lucide-react';

interface GetStartedInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedInfoModal = ({ isOpen, onClose }: GetStartedInfoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-primary">
            <ChefHat className="w-7 h-7" />
            Get Started with Gluten World
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              What You'll Get Access To
            </h3>
            <p className="text-muted-foreground mb-4">
              Join thousands of people living confidently with gluten-free lifestyles through our comprehensive platform.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <ChefHat className="w-6 h-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">AI Recipe Conversion</h4>
                <p className="text-sm text-muted-foreground">
                  Transform any recipe into a delicious gluten-free alternative instantly with our advanced AI technology.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <BookOpen className="w-6 h-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Extensive Recipe Library</h4>
                <p className="text-sm text-muted-foreground">
                  Access our tested collection of gluten-free recipes for baking, meals, breakfast, snacks, and smoothies.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Users className="w-6 h-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Community Support</h4>
                <p className="text-sm text-muted-foreground">
                  Connect with fellow gluten-free enthusiasts, share experiences, and discover new favorites together.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Heart className="w-6 h-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Ingredient Label Scanner</h4>
                <p className="text-sm text-muted-foreground">
                  Scan ingredient labels with your phone to get instant analysis for gluten and other allergens.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🎉 Start with a FREE 5-Day Trial
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Get full access to all features for 5 days completely free. No commitment required - cancel anytime during your trial.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              className="flex-1" 
              onClick={onClose}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={onClose}>
              Learn More
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};