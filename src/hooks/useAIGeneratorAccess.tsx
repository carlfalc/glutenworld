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

      // Check if user has yearly subscription (automatic access)
      if (subscription_tier === 'Annual') {
        console.log('✅ User has Annual subscription - granting access');
        setHasAccess(true);
        setHasPaidUpgrade(false);
        setLoading(false);
        return;
      }

      console.log('💳 Checking paid upgrade in database...');
      
      // First check by user_id, then by email as fallback
      let accessData = null;
      
      const { data: userIdData, error: userIdError } = await supabase
        .from('ai_generator_access')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (userIdError) {
        console.error('❌ Database error checking by user_id:', userIdError.message);
      }

      if (userIdData && userIdData.paid === true) {
        accessData = userIdData;
        console.log('✅ Found paid upgrade by user_id');
      } else {
        // Fallback to email check
        console.log('🔍 No result by user_id, trying by email...');
        const { data: emailData, error: emailError } = await supabase
          .from('ai_generator_access')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();
        
        if (emailError) {
          console.error('❌ Database error checking by email:', emailError.message);
        }
        
        if (emailData && emailData.paid === true) {
          accessData = emailData;
          console.log('✅ Found paid upgrade by email');
        }
      }

      if (accessData && accessData.paid === true) {
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