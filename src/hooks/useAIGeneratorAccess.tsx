
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from './useSubscription';
import { useUserRole } from './useUserRole';

export const useAIGeneratorAccess = () => {
  const { user } = useAuth();
  const { subscription_tier } = useSubscription();
  const { isOwner } = useUserRole();
  const [hasAccess, setHasAccess] = useState(false);
  const [hasPaidUpgrade, setHasPaidUpgrade] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAccess = async () => {
    setLoading(true);

    if (!user) {
      console.log('🔒 No user logged in');
      setHasAccess(false);
      setHasPaidUpgrade(false);
      setLoading(false);
      return;
    }

    console.log('🔍 Checking AI generator access for user:', user.email);
    console.log('🔍 User ID:', user.id);
    console.log('🔍 Subscription tier:', subscription_tier);

    try {
      // Owner always has access
      if (isOwner) {
        console.log('✅ Owner access - granting AI generator access');
        setHasAccess(true);
        setHasPaidUpgrade(false);
        setLoading(false);
        return;
      }

      // Annual subscription has automatic access
      if (subscription_tier === 'Annual') {
        console.log('✅ User has Annual subscription - granting access');
        setHasAccess(true);
        setHasPaidUpgrade(false);
        setLoading(false);
        return;
      }

      console.log('💳 Checking paid upgrade in database (by user_id only due to RLS)...');

      // With new RLS policies, users can only read rows where user_id = auth.uid()
      const { data: accessRow, error } = await supabase
        .from('ai_generator_access')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Database error checking ai_generator_access:', error.message);
      }

      if (accessRow && accessRow.paid === true) {
        console.log('✅ Granting AI generator access - user has paid');
        setHasAccess(true);
        setHasPaidUpgrade(true);
      } else {
        console.log('❌ No paid upgrade found');
        setHasAccess(false);
        setHasPaidUpgrade(false);
      }
    } catch (error) {
      console.error('💥 Exception in checkAccess:', error);
      setHasAccess(false);
      setHasPaidUpgrade(false);
    } finally {
      setLoading(false);
    }
  };

  const purchaseUpgrade = async () => {
    if (!user) return;

    console.log('🛒 Starting AI generator upgrade purchase...');

    // This calls an Edge Function that operates with the service role to create/update records securely
    const { data, error } = await supabase.functions.invoke('ai-generator-upgrade');
    console.log('📋 Function response:', { data, error });

    if (error) {
      console.error('💥 Error purchasing AI generator upgrade:', error);
      throw error;
    }

    if (data?.url) {
      console.log('🌐 Redirecting to Stripe checkout:', data.url);
      window.open(data.url, '_blank');
    } else {
      console.error('❌ No checkout URL received');
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
    checkAccess,
  };
};
