import { useState } from 'react';
import { Search, MapPin, Star, Shield, Clock, Navigation, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FreeTrialButton from '@/components/FreeTrialButton';

const LiveDemo = () => {
  const [demoSearchValue, setDemoSearchValue] = useState('gluten free pizza New York');
  
  const demoResults = [
    {
      name: 'Senza Gluten',
      type: 'Italian Restaurant',
      rating: 4.9,
      distance: '0.3 miles',
      safetyRating: 5,
      isGF100: true,
      recentReview: 'Amazing dedicated GF kitchen! Had the margherita pizza and felt completely safe.',
      image: '/api/placeholder/300/200'
    },
    {
      name: 'Friedman\'s',
      type: 'American Diner',
      rating: 4.7,
      distance: '0.5 miles',
      safetyRating: 4,
      isGF100: false,
      recentReview: 'Great GF options but shared kitchen. Staff very knowledgeable about celiac.',
      image: '/api/placeholder/300/200'
    },
    {
      name: 'Peacefood Cafe',
      type: 'Vegan Restaurant',
      rating: 4.6,
      distance: '0.7 miles',
      safetyRating: 4,
      isGF100: false,
      recentReview: 'Excellent GF pizza crust! They mark everything clearly on the menu.',
      image: '/api/placeholder/300/200'
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch how easy it is to find safe gluten-free options anywhere in the world
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Demo search interface */}
          <div className="bg-background rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={demoSearchValue}
                  onChange={(e) => setDemoSearchValue(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg border-2 border-primary/20 focus:border-primary rounded-xl"
                  readOnly
                />
              </div>
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Searching in New York City • 1,234 results found</span>
              </div>
            </div>

            {/* Demo results */}
            <div className="p-6">
              <div className="space-y-4">
                {demoResults.map((result, index) => (
                  <div key={index} className="bg-card rounded-xl p-6 border border-border hover:border-primary/20 transition-colors">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-32 h-24 bg-muted rounded-lg flex items-center justify-center">
                        <UtensilsCrossed className="w-8 h-8 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-foreground mb-1">
                              {result.name}
                              {result.isGF100 && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                  100% GF
                                </span>
                              )}
                            </h3>
                            <p className="text-muted-foreground text-sm">{result.type}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{result.rating}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{result.distance}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Shield 
                                key={i} 
                                className={`w-4 h-4 ${i < result.safetyRating ? 'text-green-600 fill-green-600' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="text-sm text-muted-foreground ml-1">Safety Rating</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Open now</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground italic mb-4">
                          "{result.recentReview}"
                        </p>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Navigation className="w-4 h-4 mr-2" />
                            Get Directions
                          </Button>
                          <Button size="sm" variant="ghost">
                            View Menu
                          </Button>
                          <Button size="sm" variant="ghost">
                            Read Reviews
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Demo CTA */}
          <div className="text-center mt-12">
            <FreeTrialButton size="lg" className="px-8 py-4 text-lg">
              Search Your City Now →
            </FreeTrialButton>
            <p className="text-sm text-muted-foreground mt-3">
              This is real data from our database. See what's available in your area.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;