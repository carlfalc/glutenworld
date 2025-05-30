
import { Store, Star, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
    },
    {
      id: 4,
      name: "Xanthan Gum",
      seller: "BakeEssentials",
      rating: 4.7,
      price: "$6.99",
      image: "/placeholder.svg",
      category: "Additive"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="pb-4 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Store className="w-5 h-5 text-gluten-primary" />
          Community Shop
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Featured gluten-free products</p>
      </div>
      
      <div className="space-y-3">
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
      </div>
    </div>
  );
};

export default CommunityShop;
