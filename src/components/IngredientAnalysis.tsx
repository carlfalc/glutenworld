import { useState } from 'react';
import { Heart, HeartIcon, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAddToFavorites, useIsFavorite } from '@/hooks/useFavorites';

interface IngredientAnalysisProps {
  productName: string;
  analysis: string;
  safetyRating?: string;
  allergenWarnings?: string[];
  glutenStatus?: string;
  dairyStatus?: string;
  veganStatus?: string;
  productCategory?: string;
  productDescription?: string;
  productImageUrl?: string;
}

const IngredientAnalysis = ({
  productName,
  analysis,
  safetyRating,
  allergenWarnings = [],
  glutenStatus,
  dairyStatus,
  veganStatus,
  productCategory,
  productDescription,
  productImageUrl
}: IngredientAnalysisProps) => {
  const addToFavorites = useAddToFavorites();
  const { data: isFavorite } = useIsFavorite('product', { productName });
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToFavorites = async () => {
    if (isFavorite) return;
    
    setIsSaving(true);
    try {
      await addToFavorites.mutateAsync({
        type: 'product',
        product_name: productName,
        product_description: productDescription,
        product_image_url: productImageUrl,
        product_category: productCategory,
        product_scanned_at: new Date().toISOString(),
        product_analysis: analysis,
        safety_rating: safetyRating,
        allergen_warnings: allergenWarnings,
        gluten_status: glutenStatus,
        dairy_status: dairyStatus,
        vegan_status: veganStatus,
      });
    } catch (error) {
      console.error('Failed to save to favorites:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getSafetyIcon = (rating?: string) => {
    switch (rating?.toLowerCase()) {
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'caution':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'unsafe':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status?: string, type: string) => {
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
      <Badge className={`${colorMap[status] || 'bg-gray-100 text-gray-800'} text-xs`}>
        {type}: {status.replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getSafetyIcon(safetyRating)}
            Ingredient Analysis
          </CardTitle>
          <Button
            onClick={handleSaveToFavorites}
            variant={isFavorite ? "secondary" : "outline"}
            size="sm"
            disabled={isSaving || isFavorite}
            className="flex items-center gap-2"
          >
            {isFavorite ? (
              <>
                <HeartIcon className="w-4 h-4 fill-current text-red-500" />
                Saved
              </>
            ) : (
              <>
                <Heart className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save to Favorites'}
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">{productName}</h3>
          {productDescription && (
            <p className="text-sm text-muted-foreground mb-3">{productDescription}</p>
          )}
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          {getStatusBadge(glutenStatus, 'Gluten')}
          {getStatusBadge(dairyStatus, 'Dairy')}
          {getStatusBadge(veganStatus, 'Vegan')}
          {productCategory && (
            <Badge variant="outline" className="text-xs">
              {productCategory}
            </Badge>
          )}
        </div>

        {/* Safety Rating */}
        {safetyRating && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            {getSafetyIcon(safetyRating)}
            <span className="font-medium">Safety Rating: {safetyRating}</span>
          </div>
        )}

        {/* Allergen Warnings */}
        {allergenWarnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Allergen Warnings
            </h4>
            <div className="flex flex-wrap gap-1">
              {allergenWarnings.map((warning, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {warning}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Analysis */}
        <div className="space-y-2">
          <h4 className="font-medium">Detailed Analysis</h4>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {analysis}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IngredientAnalysis;
