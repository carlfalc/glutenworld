
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/subscription' 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { subscribed, is_trialing, loading: subscriptionLoading } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [hasCheckedAccess, setHasCheckedAccess] = useState(false);

  useEffect(() => {
    // Only proceed when both auth and subscription loading are complete
    if (!authLoading && !subscriptionLoading) {
      setHasCheckedAccess(true);
      
      if (!user) {
        console.log('ProtectedRoute: User not authenticated');
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this feature.",
          variant: "default",
        });
        navigate('/auth', { replace: true });
        return;
      }

      // Check if user has active subscription or trial
      if (!subscribed && !is_trialing) {
        console.log('ProtectedRoute: User lacks subscription access');
        toast({
          title: "Subscription Required",
          description: "You need an active subscription to access this feature.",
          variant: "destructive",
        });
        navigate(redirectTo, { replace: true });
        return;
      }
    }
  }, [user, subscribed, is_trialing, authLoading, subscriptionLoading, navigate, redirectTo, toast]);

  // Show loading while checking auth and subscription
  if (authLoading || subscriptionLoading || !hasCheckedAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gluten-primary/10 via-gluten-secondary/5 to-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gluten-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gluten-primary/10 via-gluten-secondary/5 to-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-gluten-primary mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to sign in to access this feature
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => navigate('/auth', { replace: true })}
              className="w-full bg-gluten-primary hover:bg-gluten-primary/90"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user doesn't have subscription or trial
  if (!subscribed && !is_trialing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gluten-primary/10 via-gluten-secondary/5 to-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CreditCard className="w-12 h-12 text-gluten-primary mx-auto mb-4" />
            <CardTitle>Subscription Required</CardTitle>
            <CardDescription>
              You need an active subscription to access premium features
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Complete your subscription to continue using Gluten World
            </p>
            <Button 
              onClick={() => navigate('/subscription', { replace: true })}
              className="w-full bg-gluten-primary hover:bg-gluten-primary/90"
            >
              View Subscription Options
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access, render children
  return <>{children}</>;
};
