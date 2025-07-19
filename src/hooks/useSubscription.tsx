
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTrialManagement } from '@/hooks/useTrialManagement';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  subscription_status: string | null;
  trial_expires_at: string | null;
  is_trialing: boolean;
  loading: boolean;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const { refreshTrialData } = useTrialManagement();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    subscription_status: null,
    trial_expires_at: null,
    is_trialing: false,
    loading: true,
  });

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscriptionData(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setSubscriptionData(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscriptionData({
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          subscription_status: null,
          trial_expires_at: null,
          is_trialing: false,
          loading: false,
        });
        return;
      }

      setSubscriptionData({
        subscribed: data?.subscribed || false,
        subscription_tier: data?.subscription_tier || null,
        subscription_end: data?.subscription_end || null,
        subscription_status: data?.subscription_status || null,
        trial_expires_at: data?.trial_expires_at || null,
        is_trialing: data?.is_trialing || false,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to check subscription:', error);
      setSubscriptionData({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        subscription_status: null,
        trial_expires_at: null,
        is_trialing: false,
        loading: false,
      });
    }
  };

  const createCheckout = async (plan: 'trial' | 'quarterly' | 'annual') => {
    if (!user || !session) {
      // Store the selected plan to continue after authentication
      localStorage.setItem('selectedPlan', plan);
      console.log('User not authenticated, storing plan and redirecting:', plan);
      toast({
        title: "Sign Up Required",
        description: `Please sign up to start your ${plan === 'trial' ? 'free trial' : plan + ' subscription'}.`,
        variant: "default",
      });
      // Redirect to auth page with signup tab
      window.location.href = '/auth?tab=signup';
      return;
    }

    try {
      console.log('Creating checkout session for plan:', plan);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error creating checkout:', error);
        throw error;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        // Refresh trial data after successful checkout setup
        setTimeout(() => {
          refreshTrialData();
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to create checkout:', error);
      toast({
        title: "Checkout Failed",
        description: "Unable to create checkout session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openCustomerPortal = async () => {
    if (!user || !session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage your subscription.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Opening customer portal...');
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error opening customer portal:', error);
        throw error;
      }

      if (data?.url) {
        // Open customer portal in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Failed to open customer portal:', error);
      toast({
        title: "Portal Access Failed",
        description: "Unable to access customer portal. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check subscription on mount and when user changes
  useEffect(() => {
    checkSubscription();
  }, [user, session]);

  return {
    ...subscriptionData,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    refresh: checkSubscription,
  };
};
