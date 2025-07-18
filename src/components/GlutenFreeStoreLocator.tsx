import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MapPin, Star, ExternalLink, Search, Navigation } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Store {
  id: string;
  name: string;
  address: string;
  rating: number;
  priceLevel?: number;
  types: string[];
  photoReference?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  openingHours?: {
    open_now: boolean;
  };
  googleMapsUrl: string;
}

interface SearchResult {
  results: Store[];
  searchTerms: string[];
  total: number;
}

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
  'France', 'Italy', 'Spain', 'Japan', 'South Korea', 'Brazil', 'Mexico'
];

const GlutenFreeStoreLocator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [city, setCity] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter what type of gluten-free business you're looking for",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const location = city && selectedCountry ? `${city}, ${selectedCountry}` : selectedCountry;
      
      const { data, error } = await supabase.functions.invoke('gluten-free-store-search', {
        body: {
          query: searchQuery,
          location: location
        }
      });

      if (error) throw error;

      const result: SearchResult = data;
      setStores(result.results || []);
      setSearchTerms(result.searchTerms || []);
      
      toast({
        title: "Search Complete",
        description: `Found ${result.total} gluten-free businesses`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Could not search for stores. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNearMeSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter what type of gluten-free business you're looking for",
        variant: "destructive",
      });
      return;
    }

    if (!navigator.geolocation) {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          const { data, error } = await supabase.functions.invoke('gluten-free-store-search', {
            body: {
              query: searchQuery,
              latitude,
              longitude,
              radius: 25000 // 25km radius
            }
          });

          if (error) throw error;

          const result: SearchResult = data;
          setStores(result.results || []);
          setSearchTerms(result.searchTerms || []);
          
          toast({
            title: "Search Complete",
            description: `Found ${result.total} gluten-free businesses near you`,
          });
        } catch (error) {
          console.error('Near me search error:', error);
          toast({
            title: "Search Failed",
            description: "Could not search for nearby stores. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        toast({
          title: "Location Error",
          description: "Could not access your location. Please allow location access.",
          variant: "destructive",
        });
      }
    );
  };

  const renderPriceLevel = (level?: number) => {
    if (!level) return null;
    return <span className="text-green-600">{'$'.repeat(level)}</span>;
  };

  const formatBusinessTypes = (types: string[]) => {
    const relevantTypes = types.filter(type => 
      !['establishment', 'point_of_interest'].includes(type)
    ).slice(0, 3);
    
    return relevantTypes.map(type => 
      type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Gluten-Free Stores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">What are you looking for?</label>
              <Input
                placeholder="e.g., gluten-free bakery, celiac restaurant, health food store"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">City (optional)</label>
            <Input
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleSearch} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Search Location
            </Button>
            <Button 
              onClick={handleNearMeSearch} 
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Navigation className="mr-2 h-4 w-4" />}
              Search Near Me
            </Button>
          </div>

          {searchTerms.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">AI-Enhanced Search Terms:</label>
              <div className="flex flex-wrap gap-2">
                {searchTerms.map((term, index) => (
                  <Badge key={index} variant="secondary">
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {stores.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Found {stores.length} Gluten-Free Businesses</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <Dialog key={store.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold line-clamp-2">{store.name}</h4>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{store.rating?.toFixed(1)}</span>
                          {renderPriceLevel(store.priceLevel)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {store.address}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {formatBusinessTypes(store.types).slice(0, 2).map((type, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                        {store.openingHours?.open_now !== undefined && (
                          <Badge variant={store.openingHours.open_now ? "default" : "secondary"}>
                            {store.openingHours.open_now ? "Open Now" : "Closed"}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="line-clamp-2">{store.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{store.rating?.toFixed(1)} rating</span>
                      {renderPriceLevel(store.priceLevel)}
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {store.address}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Business Types:</label>
                      <div className="flex flex-wrap gap-1">
                        {formatBusinessTypes(store.types).map((type, index) => (
                          <Badge key={index} variant="outline">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {store.openingHours?.open_now !== undefined && (
                      <Badge variant={store.openingHours.open_now ? "default" : "secondary"}>
                        {store.openingHours.open_now ? "Open Now" : "Closed"}
                      </Badge>
                    )}

                    <Button 
                      className="w-full" 
                      onClick={() => window.open(store.googleMapsUrl, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Google Maps
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlutenFreeStoreLocator;