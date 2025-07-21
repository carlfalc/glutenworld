
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface PricingCardsProps {
  showTrialOption?: boolean;
  compact?: boolean;
}

const PricingCards = ({ showTrialOption = true, compact = false }: PricingCardsProps) => {
  const { createCheckout, subscribed, subscription_tier, loading } = useSubscription();

  const plans = [
    ...(showTrialOption ? [{
      id: 'trial' as const,
      name: "5-Day Trial",
      price: "Free",
      duration: "Then $12.99 quarterly (auto-renews)",
      description: "Credit card required • Cancel anytime",
      features: [
        "5 days FREE access to all features",
        "Convert unlimited recipes",
        "AI recipe assistant", 
        "Scan ingredient labels",
        "GF restaurant & store finder",
        "Auto-converts to quarterly plan after trial",
        "Cancel before trial ends to avoid charges"
      ],
      popular: true,
      icon: <Zap className="w-5 h-5 text-blue-500" />
    }] : []),
    {
      id: 'quarterly' as const,
      name: "Quarterly",
      price: "$12.99",
      duration: "3 months",
      description: "Perfect for regular home cooks",
      features: [
        "Unlimited recipe conversions",
        "Save favorite recipes", 
        "Meal planning tools",
        "Scan Ingredient Labels",
        "Premium AI Gluten Free Chat Interface",
        "Save & Share Recipe Creations",
        "Convert any recipe to be Free of Gluten!",
        "Get Recipe Nutritional Information, Warnings", 
        "Ingredient label scanner also reports on Allergens!",
        "GF Restaurant, Cafe, Bakery, Store Finder",
        "Save favorite restaurants & stores"
      ],
      popular: true,
      icon: <Crown className="w-5 h-5 text-gluten-primary" />
    },
    {
      id: 'annual' as const,
      name: "Annual",
      price: "$29.99",
      duration: "12 months",
      description: "Best value for committed users",
      features: [
        "All the features in the Quarterly subscription but for our best price offer",
        "Annual Subscribers unlock our own specially generated recipes bonus",
        "Premium GF Restaurant, Cafe, Bakery, Store Finder with unlimited searches",
        "Save unlimited favorite restaurants & stores"
      ],
      popular: false,
      icon: <Crown className="w-5 h-5 text-amber-500" />
    }
  ];

  const handleSubscribe = (planId: 'trial' | 'quarterly' | 'annual') => {
    console.log('PricingCards: Subscribing to plan:', planId);
    
    // Store the plan selection with enhanced logging
    localStorage.setItem('selectedPlan', planId);
    sessionStorage.setItem('selectedPlan', planId);
    console.log('PricingCards: Stored plan in localStorage and sessionStorage');
    
    // Create checkout session
    createCheckout(planId);
  };

  const isCurrentPlan = (planName: string) => {
    return subscribed && subscription_tier === planName;
  };

  return (
    <div className={`grid gap-6 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
      {plans.map((plan) => (
        <Card 
          key={plan.id}
          className={`relative transition-all duration-300 hover:shadow-lg ${
            plan.popular 
              ? 'border-gluten-primary bg-gluten-primary/5 ring-2 ring-gluten-primary' 
              : isCurrentPlan(plan.name)
              ? 'border-green-500 bg-green-50'
              : 'hover:scale-105'
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gluten-primary text-primary-foreground px-4 py-1">
                Most Popular
              </Badge>
            </div>
          )}
          
          {isCurrentPlan(plan.name) && (
            <div className="absolute -top-4 right-4">
              <Badge variant="outline" className="bg-green-500 text-white border-green-500">
                Current Plan
              </Badge>
            </div>
          )}

          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              {plan.icon}
            </div>
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            {plan.id === 'annual' && (
              <div className="text-blue-600 font-bold text-lg tracking-wide">
                Most Popular Choice
              </div>
            )}
            <div className="text-4xl font-bold text-gluten-primary mb-2">
              {plan.price}
            </div>
            <CardDescription className="text-base">
              {plan.duration} • {plan.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-gluten-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
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
              disabled={loading || isCurrentPlan(plan.name)}
            >
              {isCurrentPlan(plan.name) 
                ? 'Current Plan' 
                : plan.id === 'trial' 
                ? 'Start Free Trial' 
                : 'Choose Plan'
              }
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PricingCards;
