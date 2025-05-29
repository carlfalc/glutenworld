
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import RecipeHotlist from '@/components/RecipeHotlist';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen chat-container">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 flex flex-col">
          <ChatInterface />
        </div>
        <RecipeHotlist />
      </div>
    </div>
  );
};

export default Index;
