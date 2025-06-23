
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SubscriptionStatus from '@/components/SubscriptionStatus';
import PricingCards from '@/components/PricingCards';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Subscription = () => {
  const { user, loading: authLoading } = useAuth();
  const { subscribed } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

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
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Subscription Management
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your Gluten World subscription and billing
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
