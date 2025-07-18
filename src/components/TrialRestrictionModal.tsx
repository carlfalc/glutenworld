import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Lock, Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TrialRestrictionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
}

export const TrialRestrictionModal: React.FC<TrialRestrictionModalProps> = ({
  open,
  onOpenChange,
  featureName
}) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    onOpenChange(false);
    navigate('/auth');
  };

  const handleViewPricing = () => {
    onOpenChange(false);
    navigate('/subscription');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-amber-500" />
            <DialogTitle className="text-xl">Trial Used</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            You've already tried our {featureName} feature! To continue using our premium features, please sign up for a free trial or choose a subscription plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">Free 7-Day Trial</h4>
                  <p className="text-sm text-green-700">
                    Sign up now to get unlimited access to all features for 7 days completely free.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Premium Benefits</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      Unlimited global store searches
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      Save favorite places
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      AI recipe conversion & generation
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleSignUp}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            Start Free Trial
          </Button>
          <Button 
            onClick={handleViewPricing}
            variant="outline"
            className="flex-1"
          >
            View Plans
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};