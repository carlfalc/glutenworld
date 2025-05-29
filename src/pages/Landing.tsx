
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Sparkles, Check, Users, BookOpen, Heart, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth?tab=signup');
    }
  };

  const handleSignIn = () => {
    navigate('/auth?tab=signin');
  };

  const features = [
    {
      icon: <ChefHat className="w-8 h-8 text-gluten-primary" />,
      title: "Recipe Conversion",
      description: "Transform any recipe into a delicious gluten-free alternative with our AI-powered conversion technology."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-gluten-primary" />,
      title: "Extensive Recipe Library",
      description: "Access thousands of tested gluten-free recipes for baking, meals, breakfasts, snacks, and smoothies."
    },
    {
      icon: <Users className="w-8 h-8 text-gluten-primary" />,
      title: "Community Support",
      description: "Connect with fellow gluten-free enthusiasts, share experiences, and discover new favorites together."
    },
    {
      icon: <Heart className="w-8 h-8 text-gluten-primary" />,
      title: "Personalized Experience",
      description: "Get tailored recipe suggestions based on your preferences, dietary needs, and cooking skill level."
    }
  ];

  const pricingPlans = [
    {
      name: "Free Trial",
      price: "Free",
      duration: "5 days",
      features: [
        "Convert up to 5 recipes",
        "Access basic recipe library",
        "Community chat access",
        "AI recipe assistant"
      ],
      popular: false
    },
    {
      name: "Quarterly",
      price: "$6.99",
      duration: "3 months",
      features: [
        "Unlimited recipe conversions",
        "Full recipe library access",
        "Premium community features",
        "Priority AI support",
        "Save favorite recipes",
        "Meal planning tools"
      ],
      popular: true
    },
    {
      name: "Annual",
      price: "$19.99",
      duration: "12 months",
      features: [
        "Everything in Quarterly",
        "Advanced nutrition tracking",
        "Custom recipe collections",
        "Early access to new features",
        "1-on-1 nutritionist chat",
        "Recipe video tutorials"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gluten-primary/10 via-gluten-secondary/5 to-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-gluten-primary" />
            <Sparkles className="w-6 h-6 text-gluten-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gluten World</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gluten-primary hover:bg-gluten-primary/90"
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={handleSignIn}
                className="text-foreground hover:text-gluten-primary"
              >
                Sign In
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="bg-gluten-primary hover:bg-gluten-primary/90"
              >
                Launch
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Transform Any Recipe to
            <span className="text-gluten-primary"> Gluten-Free</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Navigate the tricky world of gluten-laden products with confidence. 
            GlutenConvert provides scrumptious alternative recipes that don't contain gluten, 
            making your favorite dishes accessible and delicious.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-gluten-primary hover:bg-gluten-primary/90 text-lg px-8 py-4"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 py-4 border-gluten-primary text-gluten-primary hover:bg-gluten-primary/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-foreground mb-4">
            Why Choose Gluten World?
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform makes gluten-free living easier, tastier, and more connected than ever before.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50"
            >
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-gluten-primary/10 rounded-full w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with our free trial and upgrade to unlock the full potential of gluten-free cooking.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-gluten-primary bg-gluten-primary/5 ring-2 ring-gluten-primary' 
                  : 'bg-card/50 backdrop-blur-sm border-border/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gluten-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-gluten-primary mb-2">
                  {plan.price}
                </div>
                <CardDescription className="text-base">
                  {plan.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-gluten-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gluten-primary hover:bg-gluten-primary/90' 
                      : 'bg-gluten-secondary hover:bg-gluten-secondary/90'
                  }`}
                  onClick={handleGetStarted}
                >
                  {index === 0 ? 'Start Free Trial' : 'Choose Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-border/50">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 Gluten World. Transform your recipes, transform your life.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
