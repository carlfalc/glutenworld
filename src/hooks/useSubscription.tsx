
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from './useUserRole';

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
  const { isOwner } = useUserRole();
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
      console.log('useSubscription: Checking subscription status for user:', user.email);
      setSubscriptionData(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('useSubscription: Error checking subscription:', error);
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

      console.log('useSubscription: Subscription data received:', data);
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
      console.error('useSubscription: Failed to check subscription:', error);
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
    console.log('useSubscription: Creating checkout for plan:', plan);
    
    if (!user || !session) {
      console.log('useSubscription: User not authenticated, storing plan and redirecting:', plan);
      
      // Store plan with mobile-safe approach
      try {
        localStorage.setItem('selectedPlan', plan);
        sessionStorage.setItem('selectedPlan', plan);
      } catch (e) {
        console.warn('Storage not available, using URL parameter fallback');
      }
      
      toast({
        title: "Sign Up Required",
        description: `Please sign up to start your ${plan === 'trial' ? 'free trial' : plan + ' subscription'}.`,
        variant: "default",
      });
      
      // Use replace to avoid back button issues on mobile
      const authUrl = `/auth?tab=signup&plan=${plan}`;
      console.log('useSubscription: Redirecting to:', authUrl);
      window.location.replace(authUrl);
      return;
    }

    try {
      console.log('useSubscription: Creating checkout session for authenticated user');
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('useSubscription: Error creating checkout:', error);
        throw error;
      }

      if (data?.url) {
        console.log('useSubscription: Redirecting to Stripe checkout:', data.url);
        // Use replace for better mobile experience and to prevent back button issues
        window.location.replace(data.url);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('useSubscription: Failed to create checkout:', error);
      toast({
        title: "Checkout Failed",
        description: "Unable to start the checkout process. Please try again.",
        variant: "destructive",
      });
      
      // Avoid infinite loops by not auto-reloading
      setTimeout(() => {
        // Just show error state, don't reload
        setSubscriptionData(prev => ({ ...prev, loading: false }));
      }, 2000);
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
      console.log('useSubscription: Opening customer portal...');
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('useSubscription: Error opening customer portal:', error);
        throw error;
      }

      if (data?.url) {
        console.log('useSubscription: Redirecting to customer portal:', data.url);
        // Open customer portal in same window but use replace for mobile
        window.location.replace(data.url);
      } else {
        throw new Error('No portal URL received');
      }
    } catch (error) {
      console.error('useSubscription: Failed to open customer portal:', error);
      toast({
        title: "Portal Access Failed",
        description: "Unable to access the customer portal. Please try again.",
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
    // Owner bypasses subscription checks
    subscribed: isOwner || subscriptionData.subscribed,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    refresh: checkSubscription,
  };
};
