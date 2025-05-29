
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import RecipeHotlist from '@/components/RecipeHotlist';

const Index = () => {
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
