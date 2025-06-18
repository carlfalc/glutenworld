
import { useState } from 'react';
import { Heart, Clock, Users, Star, Package, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
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
              <div className="space-y-3">
                {productFavorites.map((favorite) => (
                  <Card key={favorite.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm line-clamp-1">
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
                    <CardContent className="pt-0">
                      {favorite.product_description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {favorite.product_description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {favorite.product_scanned_at 
                            ? `Scanned ${new Date(favorite.product_scanned_at).toLocaleDateString()}`
                            : `Added ${new Date(favorite.created_at).toLocaleDateString()}`
                          }
                        </span>
                        {favorite.product_category && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {favorite.product_category}
                          </span>
                        )}
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
