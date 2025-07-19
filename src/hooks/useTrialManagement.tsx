import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

interface TrialData {
  isInTrial: boolean;
  trialDaysLeft: number;
  trialExpired: boolean;
  featuresLocked: boolean;
  loading: boolean;
  // Backward compatibility properties
  trial_used: boolean;
  trial_expired: boolean;
  subscribed: boolean;
  subscription_tier: string | null;
}

export const useTrialManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    subscribed, 
    subscription_tier, 
    trial_expires_at, 
    is_trialing, 
    subscription_status,
    loading: subscriptionLoading,
    checkSubscription 
  } = useSubscription();

  const [trialData, setTrialData] = useState<TrialData>({
    isInTrial: false,
    trialDaysLeft: 0,
    trialExpired: false,
    featuresLocked: false,
    loading: true,
    trial_used: false,
    trial_expired: false,
    subscribed: false,
    subscription_tier: null,
  });

  const calculateDaysRemaining = (expiresAt: string | null): number => {
    if (!expiresAt) return 0;
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  useEffect(() => {
    if (!subscriptionLoading) {
      const daysLeft = trial_expires_at ? calculateDaysRemaining(trial_expires_at) : 0;
      const trialExpired = is_trialing && daysLeft === 0;
      const hasActiveAccess = subscribed || (is_trialing && daysLeft > 0);

      setTrialData({
        isInTrial: is_trialing || false,
        trialDaysLeft: daysLeft,
        trialExpired: trialExpired,
        featuresLocked: !hasActiveAccess,
        loading: false,
        trial_used: is_trialing || false,
        trial_expired: trialExpired,
        subscribed: subscribed || false,
        subscription_tier: subscription_tier,
      });
    }
  }, [subscribed, subscription_tier, trial_expires_at, is_trialing, subscription_status, subscriptionLoading]);

  const canAccessFeatures = (): boolean => {
    // User has active subscription
    if (subscribed) return true;
    
    // User is in trial and trial hasn't expired
    if (is_trialing && trialData.trialDaysLeft > 0) return true;
    
    // Otherwise, features are locked
    return false;
  };

  const getFeatureStatus = () => {
    if (subscribed) {
      return {
        status: 'subscribed',
        message: `Active ${subscription_tier} subscription`,
        canAccess: true
      };
    }
    
    if (is_trialing && trialData.trialDaysLeft > 0) {
      return {
        status: 'trial_active',
        message: `${trialData.trialDaysLeft} days left in trial`,
        canAccess: true
      };
    }
    
    if (trialData.trialExpired) {
      return {
        status: 'trial_expired',
        message: 'Trial expired - Your subscription is now active',
        canAccess: false
      };
    }
    
    return {
      status: 'no_access',
      message: 'Subscribe to access premium features',
      canAccess: false
    };
  };

  // Since trials are now handled through Stripe checkout, we don't need a separate startTrial function
  // Users start trials by going through the checkout process with the 'trial' plan
  const startTrial = async () => {
    toast({
      title: "Start Trial",
      description: "Please use the 'Start 5-Day Trial' button to begin your trial with auto-billing.",
      variant: "default",
    });
    return false;
  };

  return {
    trialData,
    loading: trialData.loading || subscriptionLoading,
    startTrial, // Keep for backward compatibility but redirect to checkout
    canAccessFeatures,
    getFeatureStatus,
    refreshTrialData: checkSubscription // Use subscription check to refresh data
  };
};
