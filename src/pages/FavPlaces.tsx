import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Globe, Phone, Heart, X, Star, ExternalLink } from 'lucide-react';
import { useFavorites, useRemoveFromFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';

const FavPlaces = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Fetch business favorites from database
  const { data: businessFavorites = [], isLoading, refetch } = useFavorites('business');
  const removeFromFavorites = useRemoveFromFavorites();

  // Filter businesses based on search term
  const filteredBusinesses = businessFavorites.filter(business =>
    business.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.business_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.business_category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveBusiness = async (favoriteId: string) => {
    try {
      await removeFromFavorites.mutateAsync(favoriteId);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove business from favorites",
        variant: "destructive"
      });
    }
  };

  const renderPriceLevel = (level?: number) => {
    if (!level) return null;
    return (
      <span className="text-green-600 font-bold">
        {'$'.repeat(level)}
        <span className="text-muted-foreground">{'$'.repeat(4 - level)}</span>
      </span>
    );
  };

  const formatBusinessTypes = (types: string[] = []) => {
    return types.map(type => 
      type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Restaurant': 'bg-orange-100 text-orange-800 border-orange-300',
      'Cafe': 'bg-amber-100 text-amber-800 border-amber-300',
      'Bakery': 'bg-rose-100 text-rose-800 border-rose-300',
      'Health Food Store': 'bg-green-100 text-green-800 border-green-300',
      'Grocery Store': 'bg-blue-100 text-blue-800 border-blue-300',
      'default': 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[category] || colors.default;
  };

  const openInMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue/5 via-brand-blue-light/20 to-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="text-brand-blue">Favorite</span> Places
            </h1>
            <p className="text-muted-foreground text-lg">
              Your saved gluten-free restaurants, cafes, bakeries, and health food stores
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search your favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Saved Businesses Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                {searchTerm ? 'No matching favorites found' : 'No favorites saved yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start saving your favorite gluten-free places from the Store Locator'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => window.location.href = '/store-locator'}>
                  Find Places to Save
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <Card key={business.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-lg flex-1">{business.business_name}</CardTitle>
                          <Badge 
                            className={`text-xs font-medium shrink-0 ${getCategoryColor(business.business_category || '')}`}
                            variant="outline"
                          >
                            {business.business_category}
                          </Badge>
                        </div>
                        {business.business_rating && (
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{business.business_rating.toFixed(1)}</span>
                            {renderPriceLevel(business.business_price_level)}
                          </div>
                        )}
                        {business.business_types && business.business_types.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {formatBusinessTypes(business.business_types).slice(0, 2).map((type, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveBusiness(business.id)}
                        className="text-destructive hover:text-destructive ml-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{business.business_address}</span>
                    </div>
                    
                    {business.business_phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{business.business_phone}</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openInMaps(business.business_address || '')}
                        className="flex-1"
                      >
                        <MapPin className="w-4 h-4 mr-1" />
                        Directions
                      </Button>
                      
                      {business.business_website && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(business.business_website, '_blank')}
                          className="flex-1"
                        >
                          <Globe className="w-4 h-4 mr-1" />
                          Website
                        </Button>
                      )}
                      
                      {business.business_google_maps_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(business.business_google_maps_url, '_blank')}
                          className="flex-1"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Maps
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavPlaces;