import { UtensilsCrossed, Cake, Coffee, ShoppingCart, Pizza, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LocationCategories = () => {
  const categories = [
    {
      icon: UtensilsCrossed,
      name: 'Restaurants',
      count: '12,847',
      description: 'with dedicated GF menus',
      color: 'text-blue-600'
    },
    {
      icon: Cake,
      name: 'Bakeries',
      count: '3,421',
      description: '100% gluten-free bakeries',
      color: 'text-pink-600'
    },
    {
      icon: Coffee,
      name: 'Cafes',
      count: '8,932',
      description: 'with GF breakfast options',
      color: 'text-amber-600'
    },
    {
      icon: ShoppingCart,
      name: 'Grocery Stores',
      count: '15,220',
      description: 'with GF sections',
      color: 'text-green-600'
    },
    {
      icon: Pizza,
      name: 'Pizza Places',
      count: '4,328',
      description: 'with GF crust options',
      color: 'text-red-600'
    },
    {
      icon: Store,
      name: 'Specialty Shops',
      count: '6,892',
      description: 'dedicated GF stores',
      color: 'text-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Every Type of Gluten-Free Venue You Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From 100% dedicated kitchens to carefully prepared GF options, find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div key={index} className="group cursor-pointer">
                <div className="bg-card hover:bg-card/80 rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/20 h-full">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-sm mb-6 ${category.color}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {category.name}
                    </h3>
                    
                    <div className="text-3xl font-bold text-primary mb-2">
                      {category.count}
                    </div>
                    
                    <p className="text-muted-foreground mb-6">
                      {category.description}
                    </p>
                    
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Explore →
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick stats bar */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">2.4M+</div>
              <div className="text-sm text-muted-foreground">Verified Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15,000+</div>
              <div className="text-sm text-muted-foreground">Dedicated GF Kitchens</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">47</div>
              <div className="text-sm text-muted-foreground">Languages Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99.7%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationCategories;