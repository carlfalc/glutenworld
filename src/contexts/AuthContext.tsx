
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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Defer async operations to prevent auth deadlock
        if (event === 'SIGNED_IN' && session) {
          setTimeout(async () => {
            console.log('User signed in, checking subscription status...');
            try {
              await supabase.functions.invoke('check-subscription', {
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                },
              });
              
              // Check if user was trying to purchase a plan before signing in
              const selectedPlan = localStorage.getItem('selectedPlan');
              if (selectedPlan) {
                console.log('Found stored plan after sign in:', selectedPlan);
                localStorage.removeItem('selectedPlan');
                
                // Proceed with checkout for the stored plan
                try {
                  const { data, error } = await supabase.functions.invoke('create-checkout', {
                    body: { plan: selectedPlan },
                    headers: {
                      Authorization: `Bearer ${session.access_token}`,
                    },
                  });
                  
                  if (error) {
                    console.error('Error creating checkout after sign in:', error);
                  } else if (data?.url) {
                    // Open Stripe checkout in a new tab
                    window.open(data.url, '_blank');
                  }
                } catch (error) {
                  console.error('Failed to create checkout after sign in:', error);
                }
              }
            } catch (error) {
              console.error('Failed to check subscription on sign in:', error);
            }
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Check subscription status for existing session
      if (session) {
        console.log('Existing session found, checking subscription status...');
        try {
          await supabase.functions.invoke('check-subscription', {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
        } catch (error) {
          console.error('Failed to check subscription on load:', error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Check if user was redirected here for checkout
    const selectedPlan = localStorage.getItem('selectedPlan');
    const redirectUrl = selectedPlan 
      ? `${window.location.origin}/dashboard` 
      : `${window.location.origin}/dashboard`;
    
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
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signOut = async () => {
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
