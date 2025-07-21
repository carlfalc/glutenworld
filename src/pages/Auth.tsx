
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ChefHat, Sparkles, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AddressForm from '@/components/AddressForm';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  
  // Address form state
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  // Get the default tab from URL parameters
  const defaultTab = searchParams.get('tab') || 'signin';
  const errorParam = searchParams.get('error');
  
  // Check for stored plan on component mount
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored plan in multiple locations
    const storedPlan = localStorage.getItem('selectedPlan') || 
                      sessionStorage.getItem('selectedPlan') ||
                      searchParams.get('plan');
    
    if (storedPlan) {
      setSelectedPlan(storedPlan);
      console.log('Auth page detected stored plan:', storedPlan);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      console.log('User authenticated, navigating to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Handle error parameter
    if (errorParam === 'checkout_failed') {
      toast({
        title: "Checkout Error",
        description: "There was an issue processing your subscription. Please try again.",
        variant: "destructive",
      });
    }
  }, [errorParam, toast]);

  const saveUserAddress = async (userId: string) => {
    try {
      if (country) {
        const { error } = await supabase
          .from('user_addresses')
          .insert({
            user_id: userId,
            street_address: streetAddress || '',
            city: city || '',
            state_province: '',
            postal_code: postalCode || '',
            country,
          });

        if (error) {
          console.error('Error saving user address:', error);
        }
      }
    } catch (error) {
      console.error('Error saving user address:', error);
    }
  };

  const sendWelcomeEmail = async (email: string, fullName: string) => {
    try {
      const currentUrl = window.location.origin;
      const signInUrl = `${currentUrl}/auth?tab=signin`;
      
      await supabase.functions.invoke('send-welcome-email', {
        body: {
          email,
          fullName,
          signInUrl,
        },
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Handling sign in for:', email);
    const { error } = await signIn(email, password);
    
    if (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully.",
      });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Handling sign up for:', email);
    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await saveUserAddress(user.id);
        await sendWelcomeEmail(email, fullName);
      }

      toast({
        title: "Account created!",
        description: "Welcome to Gluten World! Check your email to verify your account and start your gluten-free journey.",
      });
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    console.log('Handling Google sign in');
    
    const { error } = await signInWithGoogle();
    
    if (error) {
      console.error('Google sign in error:', error);
      toast({
        title: "Error signing in with Google",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Redirecting to Google...",
        description: "You'll be redirected back once authenticated.",
      });
      // Don't set loading to false here as user will be redirected
    }
  };

  const pricingPlans = [
    {
      name: "Free Trial",
      price: "Free",
      duration: "5 days Free access to all Quarterly and Annual Subscriber features LIMITED TIME",
      features: [
        "Convert Recipes",
        "AI recipe assistant", 
        "Scan Ingredient Labels"
      ],
      popular: false
    },
    {
      name: "Quarterly",
      price: "$12.99",
      duration: "3 months",
      features: [
        "Unlimited recipe conversions",
        "Save favorite recipes",
        "Meal planning tools",
        "Scan Ingredient Labels",
        "Premium AI Gluten Free Chat Interface",
        "Save & Share Recipe Creations",
        "Convert any recipe to be Free of Gluten!",
        "Get Recipe Nutritional Information, Warnings",
        "Ingredient label scanner also reports on Allergens!"
      ],
      popular: true
    },
    {
      name: "Annual",
      price: "$29.99",
      duration: "12 months",
      features: [
        "All the features in the Quarterly subscription but for our best price offer",
        "Annual Subscribers unlock our own specially generated recipes bonus"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gluten-primary/10 via-gluten-secondary/5 to-background flex flex-col">
      {/* Header */}
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-gluten-primary" />
            <Sparkles className="w-6 h-6 text-gluten-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gluten World</h1>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="text-foreground hover:text-gluten-primary"
        >
          Back to Home
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Join Gluten World</h2>
            <p className="text-muted-foreground">
              Start your gluten-free journey today
            </p>
            {selectedPlan && (
              <Alert className="mt-4 border-blue-500 bg-blue-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You're signing up for the <strong>{selectedPlan}</strong> plan. 
                  After authentication, you'll be redirected to complete your subscription.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-center">Welcome</CardTitle>
              <CardDescription className="text-center">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setForgotPasswordOpen(true)}
                        className="text-sm text-gluten-primary hover:text-gluten-secondary hover:underline"
                      >
                        Forgot your password?
                      </button>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gluten-primary hover:bg-gluten-primary/90"
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full"
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Continue with Google
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-foreground mb-3">Country Selection</h4>
                      <AddressForm
                        streetAddress={streetAddress}
                        setStreetAddress={setStreetAddress}
                        city={city}
                        setCity={setCity}
                        postalCode={postalCode}
                        setPostalCode={setPostalCode}
                        country={country}
                        setCountry={setCountry}
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-gluten-secondary hover:bg-gluten-secondary/90"
                      disabled={loading}
                    >
                      {loading ? 'Creating account...' : 'Start Free Trial'}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full"
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Sign up with Google
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pricing Section at Bottom */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Choose Your Plan
          </h3>
          <p className="text-muted-foreground">
            Start with our free trial and upgrade anytime
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-gluten-primary bg-gluten-primary/5 ring-2 ring-gluten-primary' 
                  : 'bg-card/30 backdrop-blur-sm border-border/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gluten-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="text-2xl font-bold text-gluten-primary">
                  {plan.price}
                </div>
                <CardDescription>
                  {plan.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-gluten-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </div>
  );
};

export default Auth;
