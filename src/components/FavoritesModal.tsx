
import { useState } from 'react';
import { Heart, Clock, Users, Star, Package, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFavorites, useRemoveFromFavorites } from '@/hooks/useFavorites';

interface FavoritesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FavoritesModal = ({ open, onOpenChange }: FavoritesModalProps) => {
  const { data: recipeFavorites = [] } = useFavorites('recipe');
  const { data: productFavorites = [] } = useFavorites('product');
  const removeFromFavorites = useRemoveFromFavorites();

  const handleRemove = (favoriteId: string) => {
    removeFromFavorites.mutate(favoriteId);
  };

  const getSafetyIcon = (rating: string = '') => {
    switch (rating.toLowerCase()) {
      case 'safe':
        return <Shield className="w-4 h-4 text-green-500" />;
      case 'caution':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'unsafe':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string = '', type: string) => {
    if (!status) return null;
    
    const colorMap: { [key: string]: string } = {
      'gluten-free': 'bg-green-100 text-green-800',
      'contains-gluten': 'bg-red-100 text-red-800',
      'dairy-free': 'bg-blue-100 text-blue-800',
      'contains-dairy': 'bg-red-100 text-red-800',
      'vegan': 'bg-green-100 text-green-800',
      'not-vegan': 'bg-yellow-100 text-yellow-800',
    };

    return (
      <Badge className={`${colorMap[status] || 'bg-gray-100 text-gray-800'} text-xs mr-1 mb-1`}>
        {type}: {status.replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            My Favorites
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="recipes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recipes">
              Recipes ({recipeFavorites.length})
            </TabsTrigger>
            <TabsTrigger value="products">
              Products ({productFavorites.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recipes" className="space-y-4 mt-4">
            {recipeFavorites.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No favorite recipes yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start adding recipes to your favorites to see them here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recipeFavorites.map((favorite) => (
                  <Card key={favorite.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm line-clamp-1">
                          Recipe Favorite
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(favorite.id)}
                          className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Added {new Date(favorite.created_at).toLocaleDateString()}</span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Recipe
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4 mt-4">
            {productFavorites.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No favorite products yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start scanning and saving products to see them here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {productFavorites.map((favorite) => (
                  <Card key={favorite.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base line-clamp-1 flex items-center gap-2">
                          {favorite.safety_rating && getSafetyIcon(favorite.safety_rating)}
                          {favorite.product_name}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(favorite.id)}
                          className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      {favorite.product_description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {favorite.product_description}
                        </p>
                      )}
                      
                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-1">
                        {getStatusBadge(favorite.gluten_status, 'Gluten')}
                        {getStatusBadge(favorite.dairy_status, 'Dairy')}
                        {getStatusBadge(favorite.vegan_status, 'Vegan')}
                        {favorite.product_category && (
                          <Badge variant="outline" className="text-xs">
                            {favorite.product_category}
                          </Badge>
                        )}
                        {favorite.safety_rating && (
                          <Badge 
                            className={`text-xs ${
                              favorite.safety_rating.toLowerCase() === 'safe' 
                                ? 'bg-green-100 text-green-800'
                                : favorite.safety_rating.toLowerCase() === 'caution'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {favorite.safety_rating}
                          </Badge>
                        )}
                      </div>

                      {/* Allergen Warnings */}
                      {favorite.allergen_warnings && favorite.allergen_warnings.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-yellow-700 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Allergen Warnings:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {favorite.allergen_warnings.map((warning, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {warning}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Analysis Preview */}
                      {favorite.product_analysis && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">Analysis:</div>
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {favorite.product_analysis}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>
                          {favorite.product_scanned_at 
                            ? `Scanned ${new Date(favorite.product_scanned_at).toLocaleDateString()}`
                            : `Added ${new Date(favorite.created_at).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FavoritesModal;
