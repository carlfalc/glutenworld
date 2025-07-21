
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
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
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle auth events with proper async operations
        if (event === 'SIGNED_IN' && session) {
          handleSignInEvent(session);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Check for existing session with stored plan
      if (session) {
        await handleExistingSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignInEvent = async (session: Session) => {
    console.log('Handling sign in event for:', session.user.email);
    
    // Defer async operations to prevent auth deadlock
    setTimeout(async () => {
      try {
        // Check subscription status first
        await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        
        // Check for stored plan and handle checkout
        await handleStoredPlanCheckout(session);
      } catch (error) {
        console.error('Failed to handle sign in event:', error);
      }
    }, 0);
  };

  const handleExistingSession = async (session: Session) => {
    console.log('Handling existing session for:', session.user.email);
    
    try {
      // Check subscription status
      await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      // Check for stored plan (backup detection)
      await handleStoredPlanCheckout(session);
    } catch (error) {
      console.error('Failed to handle existing session:', error);
    }
  };

  const handleStoredPlanCheckout = async (session: Session) => {
    // Check multiple storage locations for selected plan
    const selectedPlan = localStorage.getItem('selectedPlan') || 
                        sessionStorage.getItem('selectedPlan') ||
                        getUrlParameter('plan');
    
    if (selectedPlan) {
      console.log('Found stored plan after authentication:', selectedPlan);
      
      // Clear stored plan
      localStorage.removeItem('selectedPlan');
      sessionStorage.removeItem('selectedPlan');
      
      // Proceed with checkout for the stored plan
      try {
        console.log('Creating checkout session for plan:', selectedPlan);
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: { plan: selectedPlan },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        
        if (error) {
          console.error('Error creating checkout after authentication:', error);
          // Show user-friendly error message
          if (window.location.pathname !== '/subscription') {
            window.location.href = '/subscription?error=checkout_failed';
          }
        } else if (data?.url) {
          console.log('Redirecting to checkout URL:', data.url);
          // Open Stripe checkout in same window for better UX
          window.location.href = data.url;
        }
      } catch (error) {
        console.error('Failed to create checkout after authentication:', error);
        // Redirect to subscription page with error
        if (window.location.pathname !== '/subscription') {
          window.location.href = '/subscription?error=checkout_failed';
        }
      }
    }
  };

  const getUrlParameter = (name: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('Sign up attempt for:', email);
    
    // Check if user was redirected here for checkout
    const selectedPlan = localStorage.getItem('selectedPlan');
    console.log('Selected plan during signup:', selectedPlan);
    
    // Use dashboard as redirect URL for consistency
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signUp({
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
    
    // Store plan in multiple locations for better reliability
    const selectedPlan = localStorage.getItem('selectedPlan');
    if (selectedPlan) {
      sessionStorage.setItem('selectedPlan', selectedPlan);
      console.log('Stored plan in sessionStorage for Google OAuth:', selectedPlan);
    }
    
    // Use dashboard as redirect URL for consistency
    const redirectUrl = `${window.location.origin}/dashboard`;
    console.log('Google OAuth redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: selectedPlan ? { plan: selectedPlan } : undefined,
      },
    });
    
    console.log('Google OAuth result:', error ? 'Error' : 'Success');
    return { error };
  };

  const signOut = async () => {
    console.log('Sign out attempt');
    
    // Clear any stored plans on logout
    localStorage.removeItem('selectedPlan');
    sessionStorage.removeItem('selectedPlan');
    
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
