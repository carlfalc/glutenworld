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
      // Check if user has yearly subscription (automatic access)
      if (subscription_tier === 'Annual') {
        console.log('✅ User has Annual subscription - granting access');
        setHasAccess(true);
        setHasPaidUpgrade(false);
        setLoading(false);
        return;
      }

      console.log('💳 Checking paid upgrade in database...');
      
      // First, let's see what records exist for this user
      const { data: allRecords, error: allError } = await supabase
        .from('ai_generator_access')
        .select('*')
        .eq('user_id', user.id);
      
      console.log('📝 All AI generator records for user:', allRecords);
      console.log('📝 All records error:', allError);
      
      // Check if user has paid for AI generator upgrade
      const { data, error } = await supabase
        .from('ai_generator_access')
        .select('paid')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('📊 Database query result:', { data, error });
      console.log('📊 Data type:', typeof data);
      console.log('📊 Paid value:', data?.paid);
      console.log('📊 Paid type:', typeof data?.paid);

      if (error) {
        console.error('❌ Error checking AI generator access:', error);
        setHasAccess(false);
        setHasPaidUpgrade(false);
      } else if (data && data.paid === true) {
        console.log('✅ Found paid upgrade - granting access');
        setHasAccess(true);
        setHasPaidUpgrade(true);
      } else {
        console.log('❌ No paid upgrade found - access denied');
        console.log('❌ Data exists:', !!data);
        console.log('❌ Paid value check:', data?.paid, 'strict equality:', data?.paid === true);
        setHasAccess(false);
        setHasPaidUpgrade(false);
      }
    } catch (error) {
      console.error('💥 Exception checking AI generator access:', error);
      setHasAccess(false);
      setHasPaidUpgrade(false);
    } finally {
      setLoading(false);
    }
  };

  const purchaseUpgrade = async () => {
    if (!user) return;

    console.log('🛒 Starting AI generator upgrade purchase...');
    
    try {
      console.log('📞 Calling ai-generator-upgrade function...');
      const { data, error } = await supabase.functions.invoke('ai-generator-upgrade');
      
      console.log('📋 Function response:', { data, error });
      
      if (error) throw error;
      
      if (data?.url) {
        console.log('🌐 Redirecting to Stripe checkout:', data.url);
        window.open(data.url, '_blank');
      } else {
        console.error('❌ No checkout URL received');
      }
    } catch (error) {
      console.error('💥 Error purchasing AI generator upgrade:', error);
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