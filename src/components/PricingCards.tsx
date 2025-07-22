
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Loader2 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useState } from 'react';

interface PricingCardsProps {
  showTrialOption?: boolean;
  compact?: boolean;
}

const PricingCards = ({ showTrialOption = true, compact = false }: PricingCardsProps) => {
  const { createCheckout, subscribed, subscription_tier, loading } = useSubscription();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const plans = [
    ...(showTrialOption ? [{
      id: 'trial' as const,
      name: "5-Day Free Trial",
      price: "Free",
      duration: "Then $12.99 quarterly",
      description: "Perfect way to get started",
      features: [
        "5 days FREE access to all features",
        "Convert unlimited recipes",
        "AI recipe assistant", 
        "Scan ingredient labels",
        "GF restaurant & store finder",
        "Cancel anytime during trial"
      ],
      popular: true,
      icon: <Zap className="w-5 h-5 text-blue-500" />
    }] : []),
    {
      id: 'quarterly' as const,
      name: "Quarterly Plan",
      price: "$12.99",
      duration: "Every 3 months",
      description: "Great for regular users",
      features: [
        "Unlimited recipe conversions",
        "Save favorite recipes", 
        "Meal planning tools",
        "Ingredient label scanner",
        "Premium AI chat interface",
        "Save & share recipes",
        "Nutritional information",
        "GF restaurant finder"
      ],
      popular: false,
      icon: <Crown className="w-5 h-5 text-gluten-primary" />
    },
    {
      id: 'annual' as const,
      name: "Annual Plan",
      price: "$29.99",
      duration: "Per year - Best Value!",
      description: "Save 42% with annual billing",
      features: [
        "Everything in Quarterly plan",
        "Exclusive annual subscriber recipes",
        "Unlimited restaurant searches",
        "Save unlimited restaurants",
        "Priority customer support",
        "Early access to new features"
      ],
      popular: true,
      icon: <Crown className="w-5 h-5 text-amber-500" />
    }
  ];

  const handleSubscribe = async (planId: 'trial' | 'quarterly' | 'annual') => {
    console.log('PricingCards: Starting subscription process for plan:', planId);
    
    // Prevent multiple simultaneous requests
    if (processingPlan || loading) {
      console.log('PricingCards: Already processing, ignoring request');
      return;
    }

    try {
      setProcessingPlan(planId);
      
      // Store the plan selection with enhanced logging
      try {
        localStorage.setItem('selectedPlan', planId);
        sessionStorage.setItem('selectedPlan', planId);
        console.log('PricingCards: Stored plan in localStorage and sessionStorage:', planId);
      } catch (e) {
        console.warn('PricingCards: Storage not available, will use URL parameter fallback');
      }
      
      // Create checkout session with centralized error handling
      await createCheckout(planId);
    } catch (error) {
      console.error('PricingCards: Error during subscription process:', error);
    } finally {
      // Always clear processing state after a delay to prevent infinite processing
      setTimeout(() => {
        setProcessingPlan(null);
      }, 5000);
    }
  };

  const isCurrentPlan = (planName: string) => {
    return subscribed && subscription_tier === planName;
  };

  const isProcessing = (planId: string) => {
    return processingPlan === planId;
  };

  return (
    <div className={`grid gap-4 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
      {plans.map((plan) => (
        <Card 
          key={plan.id}
          className={`relative transition-all duration-300 hover:shadow-lg ${
            plan.popular 
              ? 'border-gluten-primary bg-gluten-primary/5 ring-1 ring-gluten-primary' 
              : isCurrentPlan(plan.name)
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'hover:border-gluten-primary/50'
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <Badge className="bg-gluten-primary text-primary-foreground px-3 py-1 text-xs">
                {plan.id === 'trial' ? 'Start Here' : 'Most Popular'}
              </Badge>
            </div>
          )}
          
          {isCurrentPlan(plan.name) && (
            <div className="absolute -top-3 right-4 z-10">
              <Badge variant="outline" className="bg-green-500 text-white border-green-500 text-xs">
                Current Plan
              </Badge>
            </div>
          )}

          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-3">
              {plan.icon}
            </div>
            <CardTitle className="text-lg md:text-xl">{plan.name}</CardTitle>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-bold text-gluten-primary">
                {plan.price}
              </div>
              <CardDescription className="text-xs md:text-sm">
                {plan.duration}
              </CardDescription>
              <p className="text-xs text-muted-foreground">
                {plan.description}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-gluten-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm leading-tight">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className={`w-full ${
                plan.popular || plan.id === 'annual'
                  ? 'bg-gluten-primary hover:bg-gluten-primary/90' 
                  : 'bg-gluten-secondary hover:bg-gluten-secondary/90'
              }`}
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading || isCurrentPlan(plan.name) || isProcessing(plan.id)}
              size="sm"
            >
              {isProcessing(plan.id) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : isCurrentPlan(plan.name) ? (
                'Current Plan'
              ) : plan.id === 'trial' ? (
                'Start Free Trial'
              ) : (
                'Choose Plan'
              )}
            </Button>
            
            {plan.id === 'trial' && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                Credit card required • Cancel anytime during trial
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PricingCards;
