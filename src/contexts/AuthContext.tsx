
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any; needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        // Check for password recovery FIRST to prevent interference
        if (event === 'SIGNED_IN' && isPasswordRecoverySession()) {
          console.log('AuthContext: SIGNED_IN event is for password recovery. Preventing redirect.');
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          return; // IMPORTANT: Exit here to prevent handleSignInEvent from running
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle sign-in events only for non-recovery sessions
        if (event === 'SIGNED_IN' && session) {
          handleSignInEvent(session);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      
      // Don't set session if it's a password recovery to let the ResetPassword component handle it
      if (!isPasswordRecoverySession()) {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignInEvent = async (session: Session) => {
    console.log('Handling sign in event for:', session.user.email);
    
    // Check if this is a password recovery session
    if (isPasswordRecoverySession()) {
      console.log('Password recovery session detected, skipping subscription flow');
      return;
    }
    
    // Defer subscription handling to prevent auth deadlock
    setTimeout(async () => {
      try {
        // Check for stored plan first
        const selectedPlan = getStoredPlan();
        
        if (selectedPlan) {
          console.log('Found stored plan after authentication:', selectedPlan);
          // Clear stored plan immediately to prevent loops
          clearStoredPlan();
          
          // Use centralized subscription handler
          await handleSubscriptionFlow(selectedPlan, session);
        } else {
          // No stored plan, just verify subscription status
          await verifySubscriptionStatus(session);
        }
      } catch (error) {
        console.error('Failed to handle sign in event:', error);
        // On error, redirect to subscription page with error message
        window.location.href = '/subscription?error=checkout_failed';
      }
    }, 100); // Small delay to prevent auth conflicts
  };

  const handleSubscriptionFlow = async (plan: string, session: Session) => {
    try {
      console.log('Creating checkout session for plan:', plan);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) {
        console.error('Checkout creation failed:', error);
        throw error;
      }
      
      if (data?.url) {
        console.log('Redirecting to checkout URL:', data.url);
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Subscription flow failed:', error);
      // Redirect to subscription page with error
      window.location.href = '/subscription?error=checkout_failed';
    }
  };

  const verifySubscriptionStatus = async (session: Session) => {
    try {
      await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
    } catch (error) {
      console.error('Failed to verify subscription status:', error);
    }
  };

  const getStoredPlan = (): string | null => {
    // Check multiple storage locations
    const plan = localStorage.getItem('selectedPlan') || 
                 sessionStorage.getItem('selectedPlan') ||
                 getUrlParameter('plan');
    return plan;
  };

  const clearStoredPlan = () => {
    localStorage.removeItem('selectedPlan');
    sessionStorage.removeItem('selectedPlan');
    // Clear URL parameter by replacing current history state
    if (window.history.replaceState && getUrlParameter('plan')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('plan');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const getUrlParameter = (name: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  const isPasswordRecoverySession = (): boolean => {
    // Check if we're on the reset password page
    if (window.location.pathname === '/reset-password') {
      return true;
    }
    
    // Check URL hash fragment for recovery indicators (Supabase puts tokens in hash)
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Remove the '#'
      if (hashParams.get('type') === 'recovery') {
        return true;
      }
    }
    
    // Also check URL search parameters as fallback
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    
    // Check if any recovery tokens are present
    return type === 'recovery' && !!(accessToken && refreshToken);
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('Sign up attempt for:', email);
    
    // Store plan for post-signup handling
    const selectedPlan = getStoredPlan() || 'trial'; // Default to trial
    if (selectedPlan) {
      localStorage.setItem('selectedPlan', selectedPlan);
      sessionStorage.setItem('selectedPlan', selectedPlan);
    }
    
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    
    console.log('Signup result:', error ? 'Error' : 'Success');
    
    // Check if user needs email verification
    const needsVerification = !error && data.user && !data.user.email_confirmed_at;
    
    if (needsVerification) {
      console.log('User needs email verification:', email);
    }
    
    return { error, needsVerification };
  };

  const resendConfirmation = async (email: string) => {
    console.log('Resending confirmation email for:', email);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      }
    });
    
    console.log('Resend confirmation result:', error ? 'Error' : 'Success');
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Sign in attempt for:', email);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Signin result:', error ? 'Error' : 'Success');
    return { error };
  };

  const signInWithGoogle = async () => {
    console.log('Google sign in attempt');
    
    // Store plan for OAuth return handling
    const selectedPlan = getStoredPlan() || 'trial';
    sessionStorage.setItem('selectedPlan', selectedPlan);
    console.log('Stored plan for Google OAuth:', selectedPlan);
    
    // Use the auth page for OAuth return to ensure proper handling
    const redirectUrl = `${window.location.origin}/auth?oauth_return=true`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: { plan: selectedPlan },
      },
    });
    
    console.log('Google OAuth result:', error ? 'Error' : 'Success');
    return { error };
  };

  const signOut = async () => {
    console.log('Sign out attempt');
    
    // Clear any stored plans on logout
    clearStoredPlan();
    
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resendConfirmation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
