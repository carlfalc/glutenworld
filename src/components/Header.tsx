
import { ChefHat, Sparkles, User, LogOut, Settings, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header = () => {
  const { user, signOut } = useAuth();
  const { subscribed } = useSubscription();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="h-20 border-b border-border/50 bg-card/30 backdrop-blur-md">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-gluten-primary" />
            <Sparkles className="w-6 h-6 text-gluten-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gluten World</h1>
            <p className="text-sm text-muted-foreground">AI-Powered Recipe Conversion</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Navigation Menu */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                      onClick={() => navigate('/dashboard')}
                    >
                      Home
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                      onClick={() => navigate('/gluten-world')}
                    >
                      Gluten World
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                      onClick={() => navigate('/my-recipes')}
                    >
                      My Recipes
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                      onClick={() => navigate('/recipe-menu')}
                    >
                      Recipe Menu
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={cn(navigationMenuTriggerStyle(), "cursor-pointer flex items-center gap-1", subscribed ? "text-gluten-primary" : "")}
                      onClick={() => navigate('/subscription')}
                    >
                      {subscribed && <Crown className="w-4 h-4" />}
                      Subscription
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/subscription')}>
                    <Crown className="w-4 h-4 mr-2" />
                    Subscription
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gluten-primary hover:bg-gluten-primary/90"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
