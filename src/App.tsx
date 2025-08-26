
import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import MinimalLayout from "@/components/MinimalLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import GlutenWorld from "./pages/GlutenWorld";
import MyRecipes from "./pages/MyRecipes";
import RecipeMenu from "./pages/RecipeMenu";
import Subscription from "./pages/Subscription";
import StoreLocator from "./pages/StoreLocator";
import FavPlaces from "./pages/FavPlaces";
import AddProduct from "./pages/AddProduct";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

const App = () => {
  // Create QueryClient inside the component to ensure proper React context
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Isolated routes - no AuthProvider/ChatProvider to prevent interference */}
            <Route 
              path="/reset-password" 
              element={
                <MinimalLayout>
                  <ResetPassword />
                </MinimalLayout>
              } 
            />
            <Route 
              path="/privacy-policy" 
              element={
                <MinimalLayout>
                  <PrivacyPolicy />
                </MinimalLayout>
              } 
            />
            
            {/* All other routes with full context providers */}
            <Route path="/*" element={
              <AuthProvider>
                <ChatProvider>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/gluten-world" element={<GlutenWorld />} />
                    <Route path="/my-recipes" element={<MyRecipes />} />
                    <Route path="/recipe-menu" element={<RecipeMenu />} />
                    <Route path="/store-locator" element={<StoreLocator />} />
                    <Route path="/fav-places" element={<FavPlaces />} />
                     <Route path="/add-product" element={<AddProduct />} />
                     <Route path="/contact" element={<Contact />} />
                     <Route path="/blog" element={<Blog />} />
                     <Route path="/blog/:slug" element={<BlogPost />} />
                     <Route path="/subscription" element={<Subscription />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ChatProvider>
              </AuthProvider>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
