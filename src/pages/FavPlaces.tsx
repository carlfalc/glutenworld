import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Globe, Phone, Heart, X } from 'lucide-react';

// Define business type for now (will be replaced when database migration is applied)
interface SavedBusiness {
  id: string;
  name: string;
  address: string;
  business_type: string;
  phone?: string;
  website?: string;
  created_at: string;
}

const FavPlaces = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Temporary placeholder data until database migration is applied
  const savedBusinesses: SavedBusiness[] = [];
  const isLoading = false;

  // Filter businesses based on search term
  const filteredBusinesses = savedBusinesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.business_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveBusiness = (businessId: string) => {
    // TODO: Implement remove business functionality when database is ready
    console.log('Remove business:', businessId);
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
                      <div>
                        <CardTitle className="text-lg">{business.name}</CardTitle>
                        <p className="text-sm text-brand-blue font-medium">
                          {business.business_type}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveBusiness(business.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{business.address}</span>
                    </div>
                    
                    {business.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{business.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openInMaps(business.address)}
                        className="flex-1"
                      >
                        <MapPin className="w-4 h-4 mr-1" />
                        Directions
                      </Button>
                      
                      {business.website && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(business.website, '_blank')}
                          className="flex-1"
                        >
                          <Globe className="w-4 h-4 mr-1" />
                          Website
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