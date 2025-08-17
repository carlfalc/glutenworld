import { useState } from 'react';
import { Search, MapPin, Users, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FreeTrialButton from '@/components/FreeTrialButton';

const LocationHero = () => {
  const [searchValue, setSearchValue] = useState('');

  const quickLocations = ['New York', 'London', 'Paris', 'Tokyo'];
  const popularNearby = [
    { name: 'Friedmans', rating: 4.9, type: 'American' },
    { name: 'Senza Gluten', rating: 4.8, type: 'Italian' },
    { name: 'Wild Ginger', rating: 4.7, type: 'Asian' }
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-secondary/20 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-primary/20 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Find Safe <span className="text-primary">Gluten-Free Dining</span><br />
            Anywhere in the World
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            50,000+ verified restaurants, bakeries, cafes & shops across 190 countries
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 bg-background/80 rounded-full px-4 py-2 shadow-sm">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">50K+ Locations</span>
            </div>
            <div className="flex items-center gap-2 bg-background/80 rounded-full px-4 py-2 shadow-sm">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">190 Countries</span>
            </div>
            <div className="flex items-center gap-2 bg-background/80 rounded-full px-4 py-2 shadow-sm">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Verified by Celiacs</span>
            </div>
          </div>

          {/* Search interface */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter city, country, or use current location"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-12 pr-32 py-4 text-lg border-2 border-primary/20 focus:border-primary rounded-xl"
              />
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6"
                onClick={() => {/* Handle search */}}
              >
                Search
              </Button>
            </div>
            
            {/* Quick location buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Button variant="outline" size="sm" className="rounded-full">
                <MapPin className="w-4 h-4 mr-2" />
                Near Me
              </Button>
              {quickLocations.map((location) => (
                <Button key={location} variant="outline" size="sm" className="rounded-full">
                  {location}
                </Button>
              ))}
            </div>
          </div>

          {/* Live activity indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              3,847 people finding GF places right now
            </span>
          </div>

          {/* Popular nearby section */}
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-6 max-w-xl mx-auto mb-10">
            <h3 className="font-semibold text-foreground mb-4">Popular near you:</h3>
            <div className="space-y-3">
              {popularNearby.map((place, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div>
                    <span className="font-medium text-foreground">{place.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">• {place.type}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-primary">⭐ {place.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <FreeTrialButton size="lg" className="px-8 py-4 text-lg">
              Start 5-Day Free Trial
            </FreeTrialButton>
            <Button variant="outline" size="lg" className="px-8 py-4">
              Watch Demo
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Works offline • 50,000+ locations
          </p>
        </div>
      </div>
    </section>
  );
};

export default LocationHero;