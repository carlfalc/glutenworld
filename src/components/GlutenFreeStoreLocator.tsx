import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MapPin, Star, ExternalLink, Search, Navigation, Globe, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTrialManagement } from '@/hooks/useTrialManagement';

interface Store {
  id: string;
  name: string;
  address: string;
  rating: number;
  priceLevel?: number;
  types: string[];
  category: string;
  website?: string;
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
  totalAvailable: number;
  hasMore: boolean;
}

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
  'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
  'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
  'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
  'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
  'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
  'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const GlutenFreeStoreLocator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [city, setCity] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [lastSearchParams, setLastSearchParams] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { canAccessFeatures, getFeatureStatus } = useTrialManagement();

  // Load saved default country on component mount
  useEffect(() => {
    const savedCountry = localStorage.getItem('gluten-world-default-country');
    if (savedCountry) {
      setSelectedCountry(savedCountry);
    }
  }, []);

  // Save country as default when user selects it
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    if (country) {
      localStorage.setItem('gluten-world-default-country', country);
      toast({
        title: "Default Country Set",
        description: `${country} has been saved as your default country`,
      });
    }
  };

  // Clear default country
  const clearDefaultCountry = () => {
    localStorage.removeItem('gluten-world-default-country');
    setSelectedCountry('');
    toast({
      title: "Default Country Cleared",
      description: "You'll need to select a country for each search",
    });
  };

  const handleSearch = async (loadMore = false) => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter what type of gluten-free business you're looking for",
        variant: "destructive",
      });
      return;
    }

    const isNewSearch = !loadMore;
    const offset = isNewSearch ? 0 : currentOffset + 20;

    if (isNewSearch) {
      setLoading(true);
      setStores([]);
      setCurrentOffset(0);
    } else {
      setLoadingMore(true);
    }

    try {
      const location = city && selectedCountry ? `${city}, ${selectedCountry}` : selectedCountry;
      const searchParams = {
        query: searchQuery,
        location: location,
        limit: 20,
        offset: offset
      };
      
      const { data, error } = await supabase.functions.invoke('gluten-free-store-search', {
        body: searchParams
      });

      if (error) throw error;

      const result: SearchResult = data;
      
      if (isNewSearch) {
        setStores(result.results || []);
        setLastSearchParams(searchParams);
      } else {
        setStores(prev => [...prev, ...(result.results || [])]);
      }
      
      setSearchTerms(result.searchTerms || []);
      setHasMore(result.hasMore || false);
      setTotalAvailable(result.totalAvailable || 0);
      setCurrentOffset(offset);
      
      // Trial access is now handled by the new trial management system
      
      toast({
        title: isNewSearch ? "Search Complete" : "More Results Loaded",
        description: isNewSearch 
          ? `Found ${result.totalAvailable} gluten-free businesses (showing first ${result.total})`
          : `Loaded ${result.total} more results`,
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
      setLoadingMore(false);
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
          const searchParams = {
            query: searchQuery,
            latitude,
            longitude,
            radius: 25000, // 25km radius
            limit: 20,
            offset: 0
          };
          
          const { data, error } = await supabase.functions.invoke('gluten-free-store-search', {
            body: searchParams
          });

          if (error) throw error;

          const result: SearchResult = data;
          setStores(result.results || []);
          setSearchTerms(result.searchTerms || []);
          setHasMore(result.hasMore || false);
          setTotalAvailable(result.totalAvailable || 0);
          setCurrentOffset(0);
          setLastSearchParams(searchParams);
          
          // Trial access is now handled by the new trial management system
          
          toast({
            title: "Search Complete",
            description: `Found ${result.totalAvailable} gluten-free businesses near you (showing first ${result.total})`,
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Restaurant': return 'bg-red-100 text-red-800 border-red-200';
      case 'Cafe': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Bakery': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Health Food Store': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pharmacy': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-brand-blue/20 bg-gradient-to-r from-brand-blue-light/10 to-white/50 dark:to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-brand-blue" />
            <span className="text-brand-blue">Find GF Restaurants, Cafes and Food Stores</span>
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(false)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Country</label>
                {selectedCountry && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearDefaultCountry}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Clear Default
                  </Button>
                )}
              </div>
              <Select value={selectedCountry} onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country (will be saved as default)" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCountry && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span>Default country: {selectedCountry}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">City (optional)</label>
            <Input
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(false)}
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => handleSearch(false)} 
              disabled={loading}
              className="flex-1 store-locator-button bg-brand-blue hover:bg-brand-blue-dark text-white"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Search Location
            </Button>
            <Button 
              onClick={handleNearMeSearch} 
              disabled={loading}
              variant="outline"
              className="flex-1 store-locator-button-outline border-brand-blue text-brand-blue hover:bg-brand-blue/10"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Navigation className="mr-2 h-4 w-4" />}
              Search Near Me
            </Button>
          </div>

          {searchTerms.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium store-locator-accent">AI-Enhanced Search Terms:</label>
              <div className="flex flex-wrap gap-2">
                {searchTerms.map((term, index) => (
                  <Badge key={index} variant="secondary" className="bg-brand-blue/10 text-brand-blue border-brand-blue/30">
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Found <span className="text-brand-blue">{stores.length}</span> of <span className="text-brand-blue">{totalAvailable}</span> Gluten-Free Businesses
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <Dialog key={store.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer store-locator-card-hover transition-all duration-300 hover:shadow-lg border-brand-blue/10">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold line-clamp-2 flex-1">{store.name}</h4>
                          <Badge 
                            className={`text-xs font-medium shrink-0 ${getCategoryColor(store.category)}`}
                            variant="outline"
                          >
                            {store.category}
                          </Badge>
                        </div>
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
                    <div className="flex items-start justify-between gap-2">
                      <DialogTitle className="line-clamp-2 flex-1">{store.name}</DialogTitle>
                      <Badge 
                        className={`text-xs font-medium shrink-0 ${getCategoryColor(store.category)}`}
                        variant="outline"
                      >
                        {store.category}
                      </Badge>
                    </div>
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

                    <div className="grid gap-2">
                      {store.website && (
                        <Button 
                          variant="outline"
                          className="w-full store-locator-button-outline border-brand-blue text-brand-blue hover:bg-brand-blue/10" 
                          onClick={() => window.open(store.website, '_blank')}
                        >
                          <Globe className="mr-2 h-4 w-4" />
                          Visit Website
                        </Button>
                      )}
                      <Button 
                        className="w-full store-locator-button bg-brand-blue hover:bg-brand-blue-dark text-white" 
                        onClick={() => window.open(store.googleMapsUrl, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on Google Maps
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button 
                onClick={() => handleSearch(true)} 
                disabled={loadingMore}
                variant="outline"
                className="store-locator-button-outline border-brand-blue text-brand-blue hover:bg-brand-blue/10"
              >
                {loadingMore ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Load More Results ({totalAvailable - stores.length} remaining)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlutenFreeStoreLocator;