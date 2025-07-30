import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

interface TrialUsage {
  storeLocatorUsed: boolean;
  usageDate: string;
}

const TRIAL_KEY = 'gluten_world_trial_usage';

export const useTrialRestriction = () => {
  const { user } = useAuth();
  const { isOwner, isTesterOrOwner } = useUserRole();
  const [trialUsage, setTrialUsage] = useState<TrialUsage>({ 
    storeLocatorUsed: false, 
    usageDate: '' 
  });

  useEffect(() => {
    // Load trial usage from localStorage
    const stored = localStorage.getItem(TRIAL_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTrialUsage(parsed);
      } catch (error) {
        console.error('Error parsing trial usage:', error);
      }
    }
  }, []);

  const markStoreLocatorUsed = () => {
    const newUsage = {
      storeLocatorUsed: true,
      usageDate: new Date().toISOString()
    };
    setTrialUsage(newUsage);
    localStorage.setItem(TRIAL_KEY, JSON.stringify(newUsage));
  };

  const canUseStoreLocator = () => {
    // Tester or owner always has access
    if (isTesterOrOwner) return true;
    
    // Authenticated users can always use it
    if (user) return true;
    
    // Anonymous users can use it once
    return !trialUsage.storeLocatorUsed;
  };

  const hasUsedTrial = () => {
    return !user && trialUsage.storeLocatorUsed;
  };

  const clearTrialUsage = () => {
    localStorage.removeItem(TRIAL_KEY);
    setTrialUsage({ storeLocatorUsed: false, usageDate: '' });
  };

  return {
    canUseStoreLocator,
    markStoreLocatorUsed,
    hasUsedTrial,
    clearTrialUsage,
    trialUsage
  };
};