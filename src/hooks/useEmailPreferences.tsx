
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EmailPreferences {
  id?: string;
  trial_start: boolean;
  trial_reminder: boolean;
  payment_success: boolean;
  subscription_cancelled: boolean;
  subscription_updated: boolean;
}

export const useEmailPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<EmailPreferences>({
    trial_start: true,
    trial_reminder: true,
    payment_success: true,
    subscription_cancelled: true,
    subscription_updated: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('email_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferences({
          id: data.id,
          trial_start: data.trial_start,
          trial_reminder: data.trial_reminder,
          payment_success: data.payment_success,
          subscription_cancelled: data.subscription_cancelled,
          subscription_updated: data.subscription_updated,
        });
      }
    } catch (error) {
      console.error('Error fetching email preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<EmailPreferences>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('email_preferences')
        .upsert({
          user_id: user.id,
          email: user.email!,
          ...preferences,
          ...newPreferences,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setPreferences(prev => ({ ...prev, ...newPreferences }));
      toast.success('Email preferences updated successfully');
    } catch (error) {
      console.error('Error updating email preferences:', error);
      toast.error('Failed to update email preferences');
    }
  };

  return {
    preferences,
    loading,
    updatePreferences,
    refetch: fetchPreferences,
  };
};
