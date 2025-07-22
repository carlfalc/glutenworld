
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
import { ArrowLeft, AlertTriangle, CheckCircle, Info, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Subscription = () => {
  const { user, loading: authLoading } = useAuth();
  const { subscribed, is_trialing, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const message = searchParams.get('message');
  const error = searchParams.get('error');

  useEffect(() => {
    // Only redirect if auth is loaded and user is definitely not authenticated
    if (!authLoading && !user) {
      console.log('Subscription: User not authenticated, redirecting to auth');
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Handle URL messages
    if (message === 'subscription_required') {
      toast({
        title: "Complete Your Subscription",
        description: "Please choose a plan below to access all premium features.",
        variant: "default",
      });
    } else if (error === 'checkout_failed') {
      toast({
        title: "Checkout Error",
        description: "There was an issue with the checkout process. Please try again.",
        variant: "destructive",
      });
    }

    // Clean up URL parameters after showing messages
    if (message || error) {
      const url = new URL(window.location.href);
      url.searchParams.delete('message');
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    }
  }, [message, error, toast]);

  // Show loading while auth is loading
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

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const hasActiveAccess = subscribed || is_trialing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gluten-primary/5 to-background">
      <Header />
      
      <div className="container mx-auto px-4 py-4 md:py-8 space-y-6">
        {/* Mobile-optimized Alert Messages */}
        {message === 'subscription_required' && (
          <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-900/20">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
              <strong>Welcome to Gluten World!</strong> Choose a plan below to unlock all premium features and start your gluten-free journey.
            </AlertDescription>
          </Alert>
        )}

        {error === 'checkout_failed' && (
          <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
              <strong>Checkout Issue:</strong> Please try selecting a plan again. If the problem persists, contact support.
            </AlertDescription>
          </Alert>
        )}

        {/* Mobile-optimized Navigation */}
        <div className="flex flex-col space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/', { replace: true })}
            className="self-start"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
              Subscription Management
            </h1>
            <p className="text-base md:text-xl text-muted-foreground">
              {hasActiveAccess 
                ? "Manage your Gluten World subscription and preferences"
                : "Choose your plan to unlock all premium features"
              }
            </p>
          </div>
        </div>

        {/* Mobile-first layout */}
        <div className="space-y-6">
          {/* Current Subscription Status - Mobile optimized */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <SubscriptionStatus />
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Smartphone className="w-5 h-5 text-gluten-primary" />
                    Premium Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {hasActiveAccess 
                      ? "You're enjoying all premium features:"
                      : "Unlock these amazing features:"
                    }
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gluten-primary rounded-full flex-shrink-0"></div>
                      <span>Unlimited recipe conversions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gluten-primary rounded-full flex-shrink-0"></div>
                      <span>AI recipe assistant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gluten-primary rounded-full flex-shrink-0"></div>
                      <span>Ingredient label scanner</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gluten-primary rounded-full flex-shrink-0"></div>
                      <span>GF restaurant finder</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gluten-primary rounded-full flex-shrink-0"></div>
                      <span>Save unlimited recipes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gluten-primary rounded-full flex-shrink-0"></div>
                      <span>Advanced meal planning</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Email Preferences - Only show for subscribed users */}
          {hasActiveAccess && <EmailPreferences />}

          {/* Pricing Options - Enhanced mobile experience */}
          {!hasActiveAccess && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Choose Your Plan
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Start with our 5-day free trial - no commitment required!
                </p>
              </div>
              <PricingCards showTrialOption={true} />
              
              {/* Mobile-friendly help section */}
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <Info className="w-8 h-8 text-blue-600 mx-auto" />
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      Need Help?
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Having trouble with checkout? Try refreshing the page or contact our support team.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.reload()}
                      className="mt-2"
                    >
                      Refresh Page
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Success message for active subscribers */}
          {hasActiveAccess && (
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    You're All Set!
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    {is_trialing 
                      ? "Your free trial is active. Enjoy all premium features!"
                      : "Your subscription is active. Enjoy unlimited access to all features!"
                    }
                  </p>
                  <Button 
                    onClick={() => navigate('/', { replace: true })}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Start Using Gluten World
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
