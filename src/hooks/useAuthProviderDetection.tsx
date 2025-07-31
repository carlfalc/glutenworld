import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AuthProviderInfo {
  hasEmailPassword: boolean;
  hasGoogleOAuth: boolean;
  hasAppleOAuth: boolean;
  providers: string[];
  loading: boolean;
  error: string | null;
}

export const useAuthProviderDetection = (email?: string): AuthProviderInfo => {
  const [providerInfo, setProviderInfo] = useState<AuthProviderInfo>({
    hasEmailPassword: false,
    hasGoogleOAuth: false,
    hasAppleOAuth: false,
    providers: [],
    loading: false,
    error: null,
  });

  const detectProviders = async (userEmail: string) => {
    if (!userEmail?.trim()) {
      setProviderInfo(prev => ({ ...prev, loading: false, error: 'Email is required' }));
      return;
    }

    setProviderInfo(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Use the database function to get user auth providers
      const { data, error } = await supabase.rpc('get_user_auth_providers', {
        user_email: userEmail
      });

      if (error) {
        console.warn('Error detecting auth providers:', error);
        // Fall back to assuming email/password on error
        setProviderInfo({
          hasEmailPassword: true,
          hasGoogleOAuth: false,
          hasAppleOAuth: false,
          providers: ['email'],
          loading: false,
          error: null,
        });
        return;
      }

      // Data is already an array of provider strings from our function
      const providers = data || [];
      
      setProviderInfo({
        hasEmailPassword: providers.includes('email'),
        hasGoogleOAuth: providers.includes('google'),
        hasAppleOAuth: providers.includes('apple'),
        providers,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error in provider detection:', error);
      // Fall back to assuming email/password if there's an error
      setProviderInfo({
        hasEmailPassword: true,
        hasGoogleOAuth: false,
        hasAppleOAuth: false,
        providers: ['email'],
        loading: false,
        error: 'Unable to detect authentication providers',
      });
    }
  };

  useEffect(() => {
    if (email?.trim()) {
      detectProviders(email);
    } else {
      setProviderInfo({
        hasEmailPassword: false,
        hasGoogleOAuth: false,
        hasAppleOAuth: false,
        providers: [],
        loading: false,
        error: null,
      });
    }
  }, [email]);

  return providerInfo;
};