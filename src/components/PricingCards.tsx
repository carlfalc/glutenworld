
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
      name: "Free Trial",
      price: "Free",
      duration: "5 days Free access to all Quarterly and Annual Subscriber features LIMITED TIME",
      description: "Try all features risk-free",
      features: [
        "Convert Recipes",
        "AI recipe assistant",
        "Scan Ingredient Labels"
      ],
      popular: false,
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
        "Convert any recipe to be Free of Gluten!"
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
        "Everything in Quarterly",
        "Library of tested recipes",
        "Advanced nutrition tracking",
        "Custom recipe collections",
        "Early access to new features",
        "Recipe video tutorials"
      ],
      popular: false,
      icon: <Crown className="w-5 h-5 text-amber-500" />
    }
  ];

  const handleSubscribe = (planId: 'trial' | 'quarterly' | 'annual') => {
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
