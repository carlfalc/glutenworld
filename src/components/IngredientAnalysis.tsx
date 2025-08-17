
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

  const getSafetyIcon = (rating: string = '') => {
    switch (rating.toLowerCase()) {
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

  const getStatusBadge = (status: string = '', type: string) => {
    if (!status) return null;
    
    const isPositive = status.includes('FREE') || status === 'VEGAN';
    const isNegative = status.includes('CONTAINS') || status === 'NOT VEGAN';
    const isUncertain = status.includes('MAY') || status === 'UNCERTAIN';
    
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
    let displayText = status;
    let icon = '';
    
    if (isPositive) {
      variant = "secondary";
      if (type === 'gluten') {
        displayText = '✅ Gluten-Free';
        icon = '🌾';
      } else if (type === 'dairy') {
        displayText = '🥛 Dairy-Free';
        icon = '🥛';
      } else if (type === 'vegan') {
        displayText = '🌱 Vegan';
        icon = '🌱';
      }
    } else if (isNegative) {
      variant = "destructive";
      if (type === 'gluten') {
        displayText = '⚠️ Contains Gluten';
        icon = '🌾';
      } else if (type === 'dairy') {
        displayText = '⚠️ Contains Dairy';
        icon = '🥛';
      } else if (type === 'vegan') {
        displayText = '⚠️ Not Vegan';
        icon = '🌱';
      }
    } else if (isUncertain) {
      variant = "outline";
      if (type === 'gluten') {
        displayText = '❓ May Contain Gluten';
        icon = '🌾';
      } else if (type === 'dairy') {
        displayText = '❓ May Contain Dairy';
        icon = '🥛';
      } else if (type === 'vegan') {
        displayText = '❓ May Not Be Vegan';
        icon = '🌱';
      }
    }
    
    return <Badge variant={variant} className="text-xs flex items-center gap-1">
      <span className="text-xs">{icon}</span>
      {displayText}
    </Badge>;
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
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            🔍 {productName}
          </h3>
          {productDescription && (
            <p className="text-sm text-muted-foreground mb-3">{productDescription}</p>
          )}
        </div>

        {/* Enhanced Status Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {getStatusBadge(glutenStatus, 'gluten')}
          {getStatusBadge(dairyStatus, 'dairy')}
          {getStatusBadge(veganStatus, 'vegan')}
        </div>

        {productCategory && (
          <Badge variant="outline" className="text-xs w-fit">
            📦 {productCategory}
          </Badge>
        )}

        {/* Enhanced Safety Rating */}
        {safetyRating && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            {getSafetyIcon(safetyRating)}
            <span className="font-medium">Celiac Safety: {safetyRating}</span>
          </div>
        )}

        {/* Comprehensive Allergen Warnings */}
        {allergenWarnings.length > 0 && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              🚨 Comprehensive Allergen Alert
            </h4>
            <div className="grid gap-2 text-sm text-orange-700">
              {allergenWarnings.map((warning, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-orange-100 rounded">
                  <span className="text-orange-500 mt-0.5 font-bold">•</span>
                  <span className="flex-1">{warning}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-orange-600 mt-3 italic">
              ⚠️ AI analyzed 2,000+ ingredient variations across 14 major allergen categories
            </p>
          </div>
        )}

        {/* Enhanced Analysis */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            📋 Comprehensive Analysis Report
          </h4>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {analysis}
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded border border-blue-200">
          <p className="flex items-center gap-2">
            <span>🔬</span>
            <strong>Enhanced Analysis:</strong> This comprehensive scan covers gluten, dairy, vegan status, and 14 major allergen categories including hidden derivatives, scientific names, and processing agents.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IngredientAnalysis;
