
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import SubscriptionStatus from '@/components/SubscriptionStatus';
import EmailPreferences from '@/components/EmailPreferences';
import PricingCards from '@/components/PricingCards';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Subscription = () => {
  const { user, loading: authLoading } = useAuth();
  const { subscribed } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const message = searchParams.get('message');
  const error = searchParams.get('error');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (message === 'subscription_required') {
      toast({
        title: "Subscription Required",
        description: "You need to complete your subscription to access this feature.",
        variant: "destructive",
      });
    } else if (error === 'checkout_failed') {
      toast({
        title: "Checkout Error",
        description: "There was an issue with the checkout process. Please try again.",
        variant: "destructive",
      });
    }
  }, [message, error, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gluten-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gluten-primary/5 to-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Alert Messages */}
        {message === 'subscription_required' && (
          <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              You need an active subscription to access premium features. Please choose a plan below to continue.
            </AlertDescription>
          </Alert>
        )}

        {error === 'checkout_failed' && (
          <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              There was an issue with the checkout process. Please try selecting a plan again.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Subscription Management
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your Gluten World subscription and preferences
          </p>
        </div>

        <div className="grid gap-8 max-w-6xl mx-auto">
          {/* Current Subscription Status */}
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <SubscriptionStatus />
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {subscribed 
                      ? "You're currently enjoying all premium features:"
                      : "Upgrade to unlock these premium features:"
                    }
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gluten-primary rounded-full"></div>
                      Unlimited recipe conversions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gluten-primary rounded-full"></div>
                      Full recipe library access
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gluten-primary rounded-full"></div>
                      Premium community features
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gluten-primary rounded-full"></div>
                      Priority AI support
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gluten-primary rounded-full"></div>
                      Save unlimited favorite recipes
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gluten-primary rounded-full"></div>
                      Advanced meal planning tools
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Email Preferences */}
          <EmailPreferences />

          {/* Pricing Options */}
          {!subscribed && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Choose Your Plan
              </h2>
              <PricingCards showTrialOption={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
