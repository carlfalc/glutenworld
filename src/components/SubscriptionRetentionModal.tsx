import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Heart, DollarSign } from 'lucide-react';

interface SubscriptionRetentionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceedWithCancellation: () => void;
}

export const SubscriptionRetentionModal: React.FC<SubscriptionRetentionModalProps> = ({
  open,
  onOpenChange,
  onProceedWithCancellation,
}) => {
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const handleApplyDiscount = async () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply the discount.",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingDiscount(true);
    
    try {
      console.log('Applying 50% retention discount...');
      
      const { data, error } = await supabase.functions.invoke('apply-retention-discount', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error applying retention discount:', error);
        throw error;
      }

      console.log('Retention discount applied successfully:', data);
      setDiscountApplied(true);
      
      toast({
        title: "Discount Applied! 🎉",
        description: "Your 50% discount has been applied to your next billing cycle. Thank you for staying with us!",
        variant: "default",
      });
      
      // Close modal after success
      setTimeout(() => {
        onOpenChange(false);
        setDiscountApplied(false);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to apply retention discount:', error);
      toast({
        title: "Discount Application Failed",
        description: "We couldn't apply the discount right now. Please contact support for assistance.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  if (discountApplied) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl">Thank You for Staying! 🎉</DialogTitle>
            <DialogDescription className="text-base">
              Your 50% discount has been successfully applied. You'll see the reduced rate on your next bill.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Heart className="h-8 w-8 text-red-600" />
          </div>
          <DialogTitle className="text-xl">Wait! We'd hate to see you go</DialogTitle>
          <DialogDescription className="text-base">
            Before you cancel, we'd like to offer you something special as a valued member.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 text-center border border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-green-600">50% OFF</span>
            </div>
            <p className="text-sm text-gray-600">
              Your next billing cycle - that's significant savings just for you!
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-center">What you'll keep:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Access to all premium recipes</li>
              <li>• AI recipe conversion & generation</li>
              <li>• Unlimited favorites and collections</li>
              <li>• Priority customer support</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleApplyDiscount}
              disabled={isApplyingDiscount}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isApplyingDiscount ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Accept 50% Discount
            </Button>
            
            <Button
              variant="outline"
              onClick={onProceedWithCancellation}
              className="flex-1"
            >
              Continue with Cancellation
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            This is a one-time offer and will be applied to your next billing cycle.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};