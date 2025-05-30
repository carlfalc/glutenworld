
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import RecipeHotlist from '@/components/RecipeHotlist';
import CommunityShop from '@/components/CommunityShop';
import AddRecipeSection from '@/components/AddRecipeSection';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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

  if (!user) {
    return null; // Will redirect to auth
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <AddRecipeSection />
      <div className="border-t border-border/50">
        <CommunityShop />
      </div>
      <div className="border-t border-border/50 mt-4">
        <RecipeHotlist />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen chat-container">
      <Header />
      
      {/* Desktop Layout */}
      <div className="hidden md:flex h-[calc(100vh-80px)]">
        <div className="flex-1 flex flex-col">
          <ChatInterface />
        </div>
        <div className="w-80 border-l border-border/50 bg-card/20 backdrop-blur-md">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-[calc(100vh-80px)] flex flex-col">
        <div className="flex-1">
          <ChatInterface />
        </div>
        
        {/* Mobile Sidebar Trigger */}
        <div className="fixed bottom-4 right-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <button className="bg-gluten-primary hover:bg-gluten-secondary text-white p-3 rounded-full shadow-lg transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 bg-card/95 backdrop-blur-md border-border/50">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
