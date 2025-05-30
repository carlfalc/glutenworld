
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Sparkles, Check, Users, BookOpen, Heart, ArrowRight, Zap, Shield, Clock, Info } from 'lucide-react';
import FeatureDetailsPopup from '@/components/FeatureDetailsPopup';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showFeatureDetails, setShowFeatureDetails] = useState(false);

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
      title: "Gluten World",
      description: "Our community support portal - connect with fellow gluten-free enthusiasts, share experiences, and discover new favorites together."
    },
    {
      icon: <Heart className="w-8 h-8 text-gluten-primary" />,
      title: "Personalized Experience",
      description: "Get tailored recipe suggestions based on your preferences, dietary needs, and cooking skill level."
    }
  ];

  const keyFeatures = [
    {
      icon: <Zap className="w-12 h-12 text-gluten-primary" />,
      title: "Instant AI Conversion",
      description: "Convert any recipe to gluten-free in seconds with our advanced AI technology",
      highlight: "Save hours of research"
    },
    {
      icon: <Shield className="w-12 h-12 text-gluten-primary" />,
      title: "Safe & Tested",
      description: "All conversions are verified by nutritionists and tested by our community",
      highlight: "100% gluten-free guarantee"
    },
    {
      icon: <Clock className="w-12 h-12 text-gluten-primary" />,
      title: "Quick & Easy",
      description: "Get started in minutes with our intuitive interface and step-by-step guidance",
      highlight: "No learning curve"
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
      price: "$12.99",
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
      price: "$29.99",
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

      {/* Key Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-foreground mb-4">
            Why Thousands Choose Gluten World
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of gluten-free cooking with our revolutionary platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {keyFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gluten-primary/5 to-gluten-secondary/5 border-gluten-primary/20 relative"
            >
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 p-4 bg-gluten-primary/10 rounded-full w-fit">
                  {feature.icon}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl flex-1">{feature.title}</CardTitle>
                  {index === 0 && (
                    <Button
                      onClick={() => setShowFeatureDetails(true)}
                      className="ml-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 flex items-center gap-1"
                      size="sm"
                    >
                      <Info className="w-3 h-3" />
                      See More
                    </Button>
                  )}
                </div>
                <div className="inline-block bg-gluten-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {feature.highlight}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-foreground/80">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-foreground mb-4">
            Complete Gluten-Free Solution
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to master gluten-free cooking and connect with a supportive community
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

      <FeatureDetailsPopup 
        open={showFeatureDetails} 
        onOpenChange={setShowFeatureDetails}
        isFromLanding={true}
        onStartScanning={handleGetStarted}
      />
    </div>
  );
};

export default Landing;
