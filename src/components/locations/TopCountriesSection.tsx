import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TopCountriesSection = () => {
  const topCountries = [
    { flag: '🇺🇸', name: 'USA', count: '12,847 locations' },
    { flag: '🇬🇧', name: 'UK', count: '4,932 locations' },
    { flag: '🇨🇦', name: 'Canada', count: '3,821 locations' },
    { flag: '🇦🇺', name: 'Australia', count: '2,743 locations' },
    { flag: '🇩🇪', name: 'Germany', count: '2,156 locations' },
    { flag: '🇫🇷', name: 'France', count: '1,987 locations' },
    { flag: '🇮🇹', name: 'Italy', count: '1,876 locations' },
    { flag: '🇪🇸', name: 'Spain', count: '1,654 locations' },
    { flag: '🇯🇵', name: 'Japan', count: '1,432 locations' },
    { flag: '🇲🇽', name: 'Mexico', count: '1,298 locations' },
    { flag: '🇧🇷', name: 'Brazil', count: '987 locations' },
    { flag: '🇮🇳', name: 'India', count: '876 locations' }
  ];

  const majorCities = [
    { name: 'New York City', count: '1,234', country: 'USA' },
    { name: 'Los Angeles', count: '987', country: 'USA' },
    { name: 'London', count: '876', country: 'UK' },
    { name: 'Paris', count: '654', country: 'France' },
    { name: 'Toronto', count: '543', country: 'Canada' },
    { name: 'Sydney', count: '498', country: 'Australia' },
    { name: 'Berlin', count: '456', country: 'Germany' },
    { name: 'Tokyo', count: '432', country: 'Japan' },
    { name: 'Rome', count: '398', country: 'Italy' },
    { name: 'Barcelona', count: '376', country: 'Spain' }
  ];

  const trendingDestinations = [
    { name: 'Bali, Indonesia', count: '234', trend: '+45%' },
    { name: 'Dubai, UAE', count: '187', trend: '+38%' },
    { name: 'Prague, Czech', count: '156', trend: '+52%' },
    { name: 'Bangkok, Thailand', count: '143', trend: '+41%' },
    { name: 'Lisbon, Portugal', count: '128', trend: '+47%' },
    { name: 'Dublin, Ireland', count: '112', trend: '+39%' }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Gluten-Free Options Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive coverage across continents, with the most complete database of verified gluten-free venues
          </p>
        </div>

        <Tabs defaultValue="countries" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-12">
            <TabsTrigger value="countries" className="text-lg py-3">Top Countries</TabsTrigger>
            <TabsTrigger value="cities" className="text-lg py-3">Major Cities</TabsTrigger>
            <TabsTrigger value="trending" className="text-lg py-3">Trending Destinations</TabsTrigger>
          </TabsList>

          <TabsContent value="countries">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {topCountries.map((country, index) => (
                <div key={index} className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border hover:border-primary/20 cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{country.flag}</span>
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {country.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">{country.count}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {majorCities.map((city, index) => (
                <div key={index} className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border hover:border-primary/20 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">{city.country}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{city.count}</div>
                      <div className="text-xs text-muted-foreground">locations</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4 group-hover:bg-primary/10">
                    Explore City →
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingDestinations.map((destination, index) => (
                <div key={index} className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border hover:border-primary/20 cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {destination.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">{destination.count} locations</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                        {destination.trend}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">growth</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary/10">
                    Discover →
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Can't Find Your Location?
            </h3>
            <p className="text-muted-foreground mb-6">
              We're constantly adding new locations. Search your area or suggest a place to add to our database.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="px-6">Search My Area</Button>
              <Button variant="outline" className="px-6">Suggest Location</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopCountriesSection;