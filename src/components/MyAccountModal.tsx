import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, CreditCard, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { SubscriptionRetentionModal } from './SubscriptionRetentionModal';

interface MyAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MyAccountModal = ({ open, onOpenChange }: MyAccountModalProps) => {
  const [showRetentionModal, setShowRetentionModal] = useState(false);
  const [onProceedCallback, setOnProceedCallback] = useState<(() => void) | null>(null);
  
  const { user } = useAuth();
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    subscription_status,
    trial_expires_at,
    is_trialing,
    loading,
    openCustomerPortal 
  } = useSubscription();

  const formatEndDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const handleManageSubscription = () => {
    if (subscribed) {
      // Show retention modal first for active subscribers
      setShowRetentionModal(true);
      setOnProceedCallback(() => () => {
        setShowRetentionModal(false);
        openCustomerPortal();
      });
    } else {
      // Direct access for non-subscribers
      openCustomerPortal();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            My Account
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* User Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Email:</span>
                <div className="font-medium">{user?.email}</div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading subscription details...</div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant={subscribed || is_trialing ? "default" : "secondary"}>
                      {is_trialing ? "Trial Active" : subscribed ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  {subscription_tier && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Plan:</span>
                      <span className="text-sm font-medium">{subscription_tier}</span>
                    </div>
                  )}

                  {is_trialing && trial_expires_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Trial ends:</span>
                      <span className="text-sm font-medium text-orange-600">
                        {formatEndDate(trial_expires_at)}
                      </span>
                    </div>
                  )}

                  {subscribed && subscription_end && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Renews:</span>
                      <span className="text-sm font-medium">
                        {formatEndDate(subscription_end)}
                      </span>
                    </div>
                  )}

                  <Separator />

                  {(subscribed || is_trialing) && (
                    <div className="space-y-2">
                      <Button 
                        onClick={handleManageSubscription}
                        className="w-full"
                        variant="outline"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Manage Subscription
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Cancel subscription, update payment method, or change plan
                      </p>
                    </div>
                  )}

                  {!subscribed && !is_trialing && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        No active subscription
                      </p>
                      <Button 
                        onClick={() => window.location.href = '/subscription'}
                        className="w-full"
                      >
                        View Plans
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
      
      <SubscriptionRetentionModal
        open={showRetentionModal}
        onOpenChange={setShowRetentionModal}
        onProceedWithCancellation={onProceedCallback || (() => {})}
      />
    </Dialog>
  );
};