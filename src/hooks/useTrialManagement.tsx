import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TrialData {
  trial_used: boolean;
  trial_start_date: string | null;
  trial_end_date: string | null;
  features_locked: boolean;
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  days_remaining: number;
  trial_expired: boolean;
}

export const useTrialManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trialData, setTrialData] = useState<TrialData>({
    trial_used: false,
    trial_start_date: null,
    trial_end_date: null,
    features_locked: false,
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    days_remaining: 0,
    trial_expired: false
  });
  const [loading, setLoading] = useState(true);

  const calculateDaysRemaining = (endDate: string | null): number => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const fetchTrialData = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      // Check and update trial status first
      const { error: checkError } = await supabase.rpc('check_and_update_trial_status');
      if (checkError) {
        console.error('Error checking trial status:', checkError);
      }

      // Fetch current trial data
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching trial data:', error);
        return;
      }

      if (data) {
        const daysRemaining = data.trial_end_date ? calculateDaysRemaining(data.trial_end_date) : 0;
        const trialExpired = data.trial_used && daysRemaining === 0 && !data.subscribed;

        setTrialData({
          trial_used: data.trial_used || false,
          trial_start_date: data.trial_start_date,
          trial_end_date: data.trial_end_date,
          features_locked: data.features_locked || false,
          subscribed: data.subscribed || false,
          subscription_tier: data.subscription_tier,
          subscription_end: data.subscription_end,
          days_remaining: daysRemaining,
          trial_expired: trialExpired
        });
      }
    } catch (error) {
      console.error('Error in fetchTrialData:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTrial = async () => {
    if (!user?.email || !user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start your trial.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase.rpc('start_user_trial', {
        user_email: user.email,
        user_id_param: user.id
      });

      if (error) {
        console.error('Error starting trial:', error);
        toast({
          title: "Trial Start Failed",
          description: "Unable to start your trial. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      await fetchTrialData();
      toast({
        title: "Trial Started!",
        description: "Your 5-day free trial has begun. Enjoy all premium features!",
        variant: "default",
      });
      return true;
    } catch (error) {
      console.error('Error starting trial:', error);
      return false;
    }
  };

  const canAccessFeatures = (): boolean => {
    // If user is subscribed, they can access features
    if (trialData.subscribed) return true;
    
    // If trial is active (used and not expired), they can access features
    if (trialData.trial_used && trialData.days_remaining > 0) return true;
    
    // If no trial used yet, they can access features
    if (!trialData.trial_used) return true;
    
    // Otherwise, features are locked
    return false;
  };

  const getFeatureStatus = () => {
    if (trialData.subscribed) {
      return {
        status: 'subscribed',
        message: `Active ${trialData.subscription_tier} subscription`,
        canAccess: true
      };
    }
    
    if (trialData.trial_used && trialData.days_remaining > 0) {
      return {
        status: 'trial_active',
        message: `${trialData.days_remaining} days left in trial`,
        canAccess: true
      };
    }
    
    if (trialData.trial_expired) {
      return {
        status: 'trial_expired',
        message: 'Trial expired - Subscribe to continue',
        canAccess: false
      };
    }
    
    return {
      status: 'no_trial',
      message: 'Start your 5-day free trial',
      canAccess: true
    };
  };

  useEffect(() => {
    if (user) {
      fetchTrialData();
    } else {
      setTrialData({
        trial_used: false,
        trial_start_date: null,
        trial_end_date: null,
        features_locked: false,
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        days_remaining: 0,
        trial_expired: false
      });
      setLoading(false);
    }
  }, [user]);

  return {
    trialData,
    loading,
    startTrial,
    canAccessFeatures,
    getFeatureStatus,
    refreshTrialData: fetchTrialData
  };
};
