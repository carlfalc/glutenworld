import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Star, Clock, Crown } from 'lucide-react';
import PricingCards from '@/components/PricingCards';

interface TrialExpiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  daysUsed?: number;
}

export const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({
  open,
  onOpenChange,
  daysUsed = 5
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-amber-500" />
            <DialogTitle className="text-2xl">Thank You for Trying Gluten World!</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thank you message */}
          <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-amber-800">Your 5-Day Trial Has Ended</h3>
              </div>
              <p className="text-amber-700 mb-4">
                We hope you enjoyed exploring all the amazing features of Gluten World! 
                You've experienced the power of our AI recipe conversion, global store locator, 
                and premium gluten-free community.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-amber-600">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>AI Recipe Conversion Used</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Store Locator Accessed</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Community Features Explored</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits reminder */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Continue Your Gluten-Free Journey</h4>
                  <p className="text-blue-700 mb-3">
                    Stay with us and keep enjoying unlimited access to all our premium features:
                  </p>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Unlimited AI recipe conversions to gluten-free alternatives</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Global gluten-free store locator with real-time results</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Save unlimited favorite recipes and places</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Access to our growing community of gluten-free enthusiasts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Priority customer support and new feature access</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing options */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Choose Your Plan</h3>
            <p className="text-center text-muted-foreground">
              Select the perfect plan to continue your gluten-free lifestyle journey
            </p>
            <PricingCards showTrialOption={false} compact={true} />
          </div>

          {/* Auto-billing notice */}
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 text-center">
                <strong>Auto-Billing:</strong> Your subscription will automatically renew at the end of each billing period. 
                You can cancel anytime from your account settings or manage your subscription through our customer portal.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};