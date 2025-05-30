
import { Store, Star, Users, Clock, MessageCircle, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CommunityShop = () => {
  const shopItems = [
    {
      id: 1,
      name: "Premium Almond Flour",
      seller: "GlutenFreeChef",
      rating: 4.8,
      price: "$12.99",
      image: "/placeholder.svg",
      category: "Flour"
    },
    {
      id: 2,
      name: "Organic Coconut Flour",
      seller: "HealthyBaker",
      rating: 4.6,
      price: "$8.50",
      image: "/placeholder.svg",
      category: "Flour"
    },
    {
      id: 3,
      name: "Gluten-Free Pasta Mix",
      seller: "PastaLover",
      rating: 4.9,
      price: "$15.99",
      image: "/placeholder.svg",
      category: "Mix"
    }
  ];

  const communityPosts = [
    {
      id: 1,
      user: "BakeExpert",
      content: "Just tried the new almond flour blend - amazing results!",
      likes: 24,
      comments: 8,
      time: "2h ago"
    },
    {
      id: 2,
      user: "GlutenFreeMom",
      content: "Looking for tips on making fluffy bread without xanthan gum",
      likes: 15,
      comments: 12,
      time: "4h ago"
    },
    {
      id: 3,
      user: "ChefAlex",
      content: "New recipe video uploaded - chocolate chip cookies!",
      likes: 42,
      comments: 18,
      time: "6h ago"
    }
  ];

  return (
    <div className="p-4">
      <Tabs defaultValue="community" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="community" className="text-xs">Community</TabsTrigger>
          <TabsTrigger value="shop" className="text-xs">Shop</TabsTrigger>
        </TabsList>
        
        <TabsContent value="community" className="space-y-3 mt-0">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-gluten-primary" />
              Community Feed
            </h3>
          </div>
          
          {communityPosts.map((post) => (
            <Card 
              key={post.id}
              className="bg-card/30 border-border/30 hover:bg-card/50 transition-colors cursor-pointer group"
            >
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{post.user}</span>
                    <span className="text-xs text-muted-foreground">{post.time}</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="shop" className="space-y-3 mt-0">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Store className="w-4 h-4 text-gluten-primary" />
              Featured Products
            </h3>
          </div>
          
          {shopItems.map((item) => (
            <Card 
              key={item.id}
              className="bg-card/30 border-border/30 hover:bg-card/50 transition-colors cursor-pointer group"
            >
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                    <Store className="w-6 h-6 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground group-hover:text-gluten-primary transition-colors truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">by {item.seller}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-muted-foreground">{item.rating}</span>
                      </div>
                      <span className="text-sm font-semibold text-gluten-primary">{item.price}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityShop;
