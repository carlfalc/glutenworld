import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTrialRestriction } from '@/hooks/useTrialRestriction';
import { TrialRestrictionModal } from '@/components/TrialRestrictionModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Sparkles, Users, BookOpen, Heart, ArrowRight, Zap, Shield, Clock, Info, MapPin, Globe, ExternalLink } from 'lucide-react';
import FeatureDetailsPopup from '@/components/FeatureDetailsPopup';
import PricingCards from '@/components/PricingCards';
import { AIRecipeGenerator } from '@/components/AIRecipeGenerator';
const Landing = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [showFeatureDetails, setShowFeatureDetails] = useState(false);
  const [showTrialRestriction, setShowTrialRestriction] = useState(false);
  const { canUseStoreLocator, hasUsedTrial } = useTrialRestriction();
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

  const handleStoreLocatorTry = () => {
    if (canUseStoreLocator()) {
      navigate('/store-locator');
    } else {
      setShowTrialRestriction(true);
    }
  };
  const features = [{
    icon: <ChefHat className="w-8 h-8 text-gluten-primary" />,
    title: "Recipe Conversion",
    description: "Transform any recipe into a delicious gluten-free alternative with our AI-powered conversion technology."
  }, {
    icon: <BookOpen className="w-8 h-8 text-gluten-primary" />,
    title: "Extensive Recipe Library",
    description: "Our library of tested gluten-free recipes for baking, meals, breakfasts, snacks, and smoothies."
  }, {
    icon: <MapPin className="w-8 h-8 text-blue-600" />,
    title: "Global Store Locator",
    description: "Find gluten-free restaurants, bakeries, and food stores worldwide with directions, websites, menus, and verified reviews - your complete dining companion."
  }, {
    icon: <Users className="w-8 h-8 text-gluten-primary" />,
    title: "Gluten World",
    description: "Our community support portal - connect with fellow gluten-free enthusiasts, share experiences, and discover new favorites together."
  }, {
    icon: <Sparkles className="w-8 h-8 text-gluten-primary" />,
    title: "Ingredient Label Scanner",
    description: "Use the app and your phone to scan labels and get an instant analysis of warnings for not just Gluten contained, but also other allergens, whether dairy, vegan, vegetarian."
  }];
  const keyFeatures = [{
    icon: <Zap className="w-12 h-12 text-gluten-primary" />,
    title: "Instant AI Conversion",
    description: "Convert any recipe to gluten-free in seconds with our advanced AI technology",
    highlight: "Save hours of research"
  }, {
    icon: <MapPin className="w-12 h-12 text-blue-600" />,
    title: "Worldwide Store Finder",
    description: "Discover gluten-free restaurants, bakeries & stores globally with AI-powered search, directions, websites & menus",
    highlight: "195 countries covered"
  }, {
    icon: <Shield className="w-12 h-12 text-gluten-primary" />,
    title: "Safe & Tested",
    description: "All conversions are verified by nutritionists and tested by our community",
    highlight: "100% gluten-free guarantee"
  }, {
    icon: <Clock className="w-12 h-12 text-gluten-primary" />,
    title: "Quick & Easy",
    description: "Get started in minutes with our intuitive interface and step-by-step guidance",
    highlight: "No learning curve"
  }];
   return <div className="min-h-screen bg-gradient-to-br from-gluten-primary/10 via-gluten-secondary/5 to-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-gluten-primary" />
            <Sparkles className="w-6 h-6 text-gluten-secondary" />
          </div>
          <div>
            <h1 
              className="text-2xl font-bold text-foreground hover:text-gluten-primary cursor-pointer transition-colors duration-200"
              onClick={() => setShowFeatureDetails(true)}
            >
              Gluten World
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleSignIn} className="text-foreground hover:text-gluten-primary">
            Sign In
          </Button>
          <Button onClick={handleGetStarted} className="bg-gluten-primary hover:bg-gluten-primary/90 flex flex-col h-auto py-2 px-4">
            <span className="text-white font-medium">Sign up</span>
            <span className="text-white text-xs font-medium">FREE 5 DAY TRIAL</span>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Transform Any Recipe to
            <span className="text-gluten-primary"> Gluten-Free</span>
            <br />
            <span className="text-foreground">& <span className="text-blue-600">Scan Labels</span> to Get Precise Information</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">Navigate the tricky world of Gluten-laden & Allergen products with confidence. You can scan ingedient labels that will quickly illustrate whether the product is GF/VEGAN/VEGETARIAN/ DAIRY FREE 😊 'GlutenConvert' converts your favorite recipes uploaded without gluten & our 'Recipe Creator' - Creates recipes that don't contain gluten, making your favorite dishes accessible and delicious.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted} className="bg-gluten-primary hover:bg-gluten-primary/90 text-lg px-8 py-4">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({
            behavior: 'smooth'
          })} className="text-lg px-8 py-4 border-gluten-primary text-gluten-primary hover:bg-gluten-primary/10">
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
            Take pictures of your labels when shopping and see all warnings, create recipes free of gluten, save recipes and much more. Simple mobile app!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {keyFeatures.map((feature, index) => <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gluten-primary/5 to-gluten-secondary/5 border-gluten-primary/20 relative">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 p-4 bg-gluten-primary/10 rounded-full w-fit">
                  {feature.icon}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl flex-1">{feature.title}</CardTitle>
                  {index === 0 && <Button onClick={() => setShowFeatureDetails(true)} className="ml-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 flex items-center gap-1" size="sm">
                      <Info className="w-3 h-3" />
                      See More
                    </Button>}
                  {index === 1 && <Button onClick={handleStoreLocatorTry} className="ml-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 flex items-center gap-1" size="sm">
                      <ExternalLink className="w-3 h-3" />
                      {user ? "Try Now" : hasUsedTrial() ? "Sign Up" : "Try Now"}
                    </Button>}
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
            </Card>)}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-foreground mb-4">
            Complete Gluten-Free Solution
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to master gluten-free cooking and connect with a supportive community, just type, take pictures or talk to our AI! Its that simple</p>
        </div>
        
         <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
           {features.map((feature, index) => <Card key={index} className={`text-center hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50 ${index === 2 ? 'ring-2 ring-blue-500 border-blue-500/50' : index === 4 ? 'ring-2 ring-blue-500 border-blue-500/50' : ''} relative`}>
               {(index === 2 || index === 4) && (
                 <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                   <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                     {index === 2 ? 'Premium Feature' : 'Our Most Popular Feature'}
                   </div>
                 </div>
               )}
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
             </Card>)}
         </div>
      </section>

      {/* AI Recipe Generator Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-foreground mb-4">
            AI Recipe Generator
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our own generated recipes split into Breakfast, Snacks, Lunch and Dinner. Unlocked for Annual Subscribers
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <AIRecipeGenerator />
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
        
        <div className="max-w-5xl mx-auto">
          <PricingCards />
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-border/50">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 Gluten World. Transform your recipes, transform your life.</p>
        </div>
      </footer>

      <FeatureDetailsPopup open={showFeatureDetails} onOpenChange={setShowFeatureDetails} isFromLanding={true} onStartScanning={handleGetStarted} />
      <TrialRestrictionModal 
        open={showTrialRestriction} 
        onOpenChange={setShowTrialRestriction} 
        featureName="Global Store Locator" 
      />
    </div>;
};
export default Landing;