import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from './useSubscription';

export const useAIGeneratorAccess = () => {
  const { user } = useAuth();
  const { subscription_tier } = useSubscription();
  const [hasAccess, setHasAccess] = useState(false);
  const [hasPaidUpgrade, setHasPaidUpgrade] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAccess = async () => {
    if (!user) {
      setHasAccess(false);
      setHasPaidUpgrade(false);
      setLoading(false);
      return;
    }

    try {
      // Check if user has yearly subscription (automatic access)
      if (subscription_tier === 'Annual') {
        setHasAccess(true);
        setHasPaidUpgrade(false);
        setLoading(false);
        return;
      }

      // Check if user has paid for AI generator upgrade
      const { data, error } = await supabase
        .from('ai_generator_access')
        .select('paid')
        .eq('user_id', user.id)
        .eq('paid', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking AI generator access:', error);
        setHasAccess(false);
        setHasPaidUpgrade(false);
      } else if (data) {
        setHasAccess(true);
        setHasPaidUpgrade(true);
      } else {
        setHasAccess(false);
        setHasPaidUpgrade(false);
      }
    } catch (error) {
      console.error('Error checking AI generator access:', error);
      setHasAccess(false);
      setHasPaidUpgrade(false);
    } finally {
      setLoading(false);
    }
  };

  const purchaseUpgrade = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('ai-generator-upgrade');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error purchasing AI generator upgrade:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkAccess();
  }, [user, subscription_tier]);

  return {
    hasAccess,
    hasPaidUpgrade,
    loading,
    purchaseUpgrade,
    checkAccess
  };
};