
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Info, BookOpen, Heart, Home, Globe, MapPin, Store, Settings, LogOut, User } from 'lucide-react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import RecipeHotlist from '@/components/RecipeHotlist';
import CommunityShop from '@/components/CommunityShop';
import AddRecipeSection from '@/components/AddRecipeSection';
import SubscriptionStatus from '@/components/SubscriptionStatus';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { AIRecipeGenerator } from '@/components/AIRecipeGenerator';
import { useTrialManagement } from '@/hooks/useTrialManagement';
import { TrialExpiredModal } from '@/components/TrialExpiredModal';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { trialData, canAccessFeatures, startTrial, refreshTrialData } = useTrialManagement();
  const [showTrialExpiredModal, setShowTrialExpiredModal] = useState(false);

  // Handle trial logic when user logs in
  useEffect(() => {
    if (user && !trialData.trial_used && !trialData.subscribed) {
      // Auto-start trial for new users
      setTimeout(() => {
        startTrial();
      }, 1000);
    } else if (user && trialData.trial_expired && !trialData.subscribed) {
      // Show trial expired modal if trial has ended and user isn't subscribed
      setTimeout(() => {
        setShowTrialExpiredModal(true);
      }, 1500);
    }
  }, [user, trialData.trial_used, trialData.trial_expired, trialData.subscribed]);

  // Handle URL params (success/canceled from Stripe checkout)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "Payment Successful!",
        description: "Your subscription is now active. Welcome to Gluten World Premium!",
        variant: "default",
      });
      refreshTrialData();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('canceled') === 'true') {
      toast({
        title: "Payment Canceled",
        description: "No charges were made. You can try again anytime.",
        variant: "destructive",
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [refreshTrialData]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full space-y-6">
      {user && <SubscriptionStatus />}
      <AIRecipeGenerator />
      <AddRecipeSection />
      <div className="border-t border-border/50 pt-6">
        <CommunityShop />
      </div>
      <div className="border-t border-border/50 pt-6">
        <RecipeHotlist />
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen chat-container">
        <Header />
      
      {/* Desktop Layout */}
      <div className="hidden md:flex h-[calc(100vh-80px)]">
        <div className="flex-1 flex flex-col">
          <ChatInterface />
        </div>
        <div className="w-80 border-l border-border/50 bg-card/20 backdrop-blur-md overflow-y-auto">
          <div className="p-4">
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Mobile Layout - Full Screen Chat */}
      <div className="md:hidden h-[calc(100vh-80px)] flex flex-col">
        <div className="flex-1">
          <ChatInterface />
        </div>
        
        {/* Mobile Sidebar Trigger - Moved to top right for better accessibility */}
        <div className="fixed top-24 right-4 z-50 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="bg-gluten-primary/90 hover:bg-gluten-primary text-white p-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 bg-card/95 backdrop-blur-md border-border/50 overflow-y-auto">
              <div className="p-4 space-y-6">
                {/* Navigation Section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-2">
                    Navigation
                  </h3>
                  <div className="space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left font-medium text-foreground hover:bg-background/60"
                      onClick={() => navigate('/dashboard')}
                    >
                      <Home className="w-5 h-5 mr-2 text-gluten-primary" />
                      Home
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left font-medium text-foreground hover:bg-background/60"
                      onClick={() => navigate('/gluten-world')}
                    >
                      <Globe className="w-5 h-5 mr-2 text-gluten-primary" />
                      Gluten World
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left font-medium text-foreground hover:bg-background/60"
                      onClick={() => navigate('/my-recipes')}
                    >
                      <BookOpen className="w-5 h-5 mr-2 text-gluten-primary" />
                      My Recipes
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left font-medium text-foreground hover:bg-background/60"
                      onClick={() => navigate('/fav-places')}
                    >
                      <MapPin className="w-5 h-5 mr-2 text-gluten-primary" />
                      Fav Places
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left font-medium text-foreground hover:bg-background/60"
                      onClick={() => navigate('/store-locator')}
                    >
                      <Store className="w-5 h-5 mr-2 text-gluten-primary" />
                      Store Locator
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left font-medium text-foreground hover:bg-background/60"
                      onClick={() => navigate('/subscription')}
                    >
                      <Settings className="w-5 h-5 mr-2 text-gluten-primary" />
                      Subscription
                    </Button>
                  </div>
                </div>

                {/* Account Section */}
                <div className="border-t border-border/50 pt-4 space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-2">
                    Account
                  </h3>
                  <div className="space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left font-medium text-foreground hover:bg-background/60"
                      onClick={() => navigate('/dashboard')}
                    >
                      <Heart className="w-5 h-5 mr-2 text-red-500" />
                      My Favorites
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left font-medium text-foreground hover:bg-background/60"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-5 h-5 mr-2 text-muted-foreground" />
                      Sign Out
                    </Button>
                  </div>
                </div>

                {/* Existing Sidebar Content */}
                <div className="border-t border-border/50 pt-6">
                  <SidebarContent />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

        {/* Trial Expired Modal */}
        <TrialExpiredModal 
          open={showTrialExpiredModal}
          onOpenChange={setShowTrialExpiredModal}
        />
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
