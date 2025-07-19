
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Info, BookOpen, Heart } from 'lucide-react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import RecipeHotlist from '@/components/RecipeHotlist';
import CommunityShop from '@/components/CommunityShop';
import AddRecipeSection from '@/components/AddRecipeSection';
import SubscriptionStatus from '@/components/SubscriptionStatus';
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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { trialData, canAccessFeatures, startTrial, refreshTrialData } = useTrialManagement();
  const [showTrialExpiredModal, setShowTrialExpiredModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to create recipes and participate in the community.",
        variant: "default",
      });
    }
  }, [user, loading]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gluten-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen chat-container">
      <Header />
      
      {/* Authentication Nudge (if not logged in) */}
      {!user && (
        <div className="bg-amber-500/10 py-2 px-4 text-amber-600 border-b border-amber-500/20">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span className="text-sm">Sign in to create recipes and join the community</span>
            </div>
            <Button 
              size="sm" 
              onClick={() => navigate('/auth')}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
      
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
                {/* My Recipes link at the top */}
                <div className="border-b border-border/50 pb-4 space-y-2">
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
                    onClick={() => navigate('/dashboard')}
                  >
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    My Favorites
                  </Button>
                </div>
                <SidebarContent />
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
  );
};

export default Dashboard;
