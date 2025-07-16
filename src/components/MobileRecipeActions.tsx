import { useState } from 'react';
import { Heart, Share, Printer, Download, MessageCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCreateRecipe, useRecipes, useDeleteRecipe } from '@/hooks/useRecipes';
import { useToast } from '@/hooks/use-toast';
import ShareRecipe from './ShareRecipe';
import { cn } from '@/lib/utils';

interface MobileRecipeActionsProps {
  recipe: {
    id: string;
    title: string;
    ingredients?: any;
    instructions?: string[];
    converted_recipe?: string;
    original_recipe?: string;
    servings?: number;
    prep_time?: number;
    cook_time?: number;
    calories_per_serving?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
  };
  className?: string;
}

const MobileRecipeActions = ({ recipe, className }: MobileRecipeActionsProps) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  
  const createRecipeMutation = useCreateRecipe();
  const deleteRecipeMutation = useDeleteRecipe();
  const { data: userRecipes } = useRecipes();
  
  // Check if recipe exists in My Recipes
  const isFav = userRecipes?.some(r => r.title === recipe.title) || false;

  const handleFavoriteToggle = async () => {
    if (isFav) {
      // Remove from My Recipes
      const existingRecipe = userRecipes?.find(r => r.title === recipe.title);
      if (existingRecipe) {
        deleteRecipeMutation.mutate(existingRecipe.id, {
          onSuccess: () => {
            toast({
              title: "Recipe Removed",
              description: "Recipe removed from My Recipes!",
            });
          }
        });
      }
    } else {
      // Save recipe to My Recipes
      const recipeData = {
        title: recipe.title,
        original_recipe: recipe.original_recipe || '',
        converted_recipe: recipe.converted_recipe || '',
        ingredients: recipe.ingredients || null,
        instructions: recipe.instructions || null,
        servings: recipe.servings || null,
        prep_time: recipe.prep_time || null,
        cook_time: recipe.cook_time || null,
        calories_per_serving: recipe.calories_per_serving || null,
        protein_g: recipe.protein_g || null,
        carbs_g: recipe.carbs_g || null,
        fat_g: recipe.fat_g || null,
        difficulty_level: 'Medium' as const,
        is_public: false
      };

      createRecipeMutation.mutate(recipeData, {
        onSuccess: () => {
          toast({
            title: "Recipe Saved",
            description: "Recipe added to My Recipes!",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to save recipe. Please try again.",
            variant: "destructive",
          });
        }
      });
    }
    setIsSheetOpen(false);
  };

  const handlePrint = () => {
    // Always use proper print dialog instead of share for printing
    const printContent = generatePrintableRecipe(recipe);
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${recipe.title} - Recipe</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 15px; 
                line-height: 1.5;
                color: #333;
                font-size: 14px;
              }
              .recipe-header { 
                border-bottom: 2px solid #333; 
                padding-bottom: 8px; 
                margin-bottom: 15px; 
              }
              .recipe-title { 
                font-size: 20px; 
                font-weight: bold; 
                margin: 0; 
              }
              .recipe-info { 
                margin: 8px 0; 
                font-size: 12px;
                color: #666;
              }
              .section { 
                margin: 15px 0; 
              }
              .section-title { 
                font-size: 16px; 
                font-weight: bold; 
                margin-bottom: 8px; 
                color: #444;
              }
              .ingredients, .instructions { 
                margin-left: 15px; 
                padding-left: 0;
              }
              .ingredients li, .instructions li { 
                margin: 3px 0; 
                font-size: 13px;
              }
              @media print {
                body { margin: 5px; font-size: 12px; }
                .recipe-title { font-size: 18px; }
                .section-title { font-size: 14px; }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      
      toast({
        title: "Recipe Print Ready",
        description: "Print dialog opened for the recipe.",
      });
    } else {
      toast({
        title: "Print Failed",
        description: "Unable to open print dialog. Please try again.",
        variant: "destructive",
      });
    }
    setIsSheetOpen(false);
  };

  const handleDownload = () => {
    const content = generateDownloadableRecipe(recipe);
    
    // Mobile-optimized download handling
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobileDevice) {
      // For mobile devices, use different approaches
      if (navigator.share) {
        // Modern mobile browsers with Web Share API
        const blob = new Blob([content], { type: 'text/plain' });
        const file = new File([blob], `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_recipe.txt`, { type: 'text/plain' });
        
        navigator.share({
          title: `${recipe.title} - Recipe`,
          text: `Download this recipe from Gluten World`,
          files: [file]
        }).then(() => {
          toast({
            title: "Recipe Shared",
            description: "Recipe file shared successfully!",
          });
        }).catch((error) => {
          console.log('File sharing not supported, falling back:', error);
          // Fallback to text sharing
          navigator.share({
            title: `${recipe.title} - Recipe`,
            text: content
          }).catch(() => {
            copyToClipboard(content);
          });
        });
      } else {
        // Fallback for older mobile browsers
        copyToClipboard(content);
        toast({
          title: "Recipe Copied",
          description: "Recipe copied to clipboard. You can paste it in any app to save it!",
        });
      }
    } else {
      // Desktop download (original implementation)
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_recipe.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Recipe Downloaded",
        description: "Recipe saved to your device.",
      });
    }
    setIsSheetOpen(false);
  };

  const handleShareToMessenger = () => {
    const recipeText = generateShareableRecipe(recipe);
    
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: recipeText,
      }).catch((error) => {
        copyToClipboard(recipeText);
      });
    } else {
      copyToClipboard(recipeText);
    }
    setIsSheetOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Recipe Copied",
        description: "Paste it in any messaging app!",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Quick Favorite Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleFavoriteToggle}
        className={cn(
          "p-2 touch-manipulation active:scale-95 transition-all duration-150",
          isFav 
            ? "text-red-600 hover:text-red-700" 
            : "text-gray-600 hover:text-red-600"
        )}
        disabled={createRecipeMutation.isPending || deleteRecipeMutation.isPending}
      >
        <Heart className={cn("w-5 h-5", isFav && "fill-current")} />
      </Button>

      {/* More Actions Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2 touch-manipulation active:scale-95 transition-all duration-150">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle>Recipe Actions</SheetTitle>
            <SheetDescription>
              Choose an action for "{recipe.title}"
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pb-6">
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-20 touch-manipulation active:scale-95 transition-transform"
              onClick={handleFavoriteToggle}
              disabled={createRecipeMutation.isPending || deleteRecipeMutation.isPending}
            >
              <Heart className={cn("w-6 h-6", isFav && "fill-current text-red-600")} />
              <span className="text-sm font-medium">{isFav ? "Remove from My Recipes" : "Save to My Recipes"}</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-20 touch-manipulation active:scale-95 transition-transform"
              onClick={handleShareToMessenger}
            >
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium">Share to Apps</span>
            </Button>


            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-20 touch-manipulation active:scale-95 transition-transform"
              onClick={handlePrint}
            >
              <Printer className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium">Print Recipe</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-20 col-span-2 touch-manipulation active:scale-95 transition-transform"
              onClick={handleDownload}
            >
              <Download className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium">Download to Device</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Share Recipe Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsShareOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Share Recipe</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsShareOpen(false)}>×</Button>
            </div>
            <ShareRecipe 
              recipe={generateShareableRecipe(recipe)} 
              title={recipe.title}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions (same as in RecipeActions)
const generatePrintableRecipe = (recipe: any): string => {
  const ingredients = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients 
    : typeof recipe.ingredients === 'string' 
    ? recipe.ingredients.split('\n') 
    : [];

  const instructions = recipe.instructions || [];
  
  return `
    <div class="recipe-header">
      <h1 class="recipe-title">${recipe.title}</h1>
      <div class="recipe-info">
        ${recipe.servings ? `Servings: ${recipe.servings}` : ''}
        ${recipe.prep_time ? ` | Prep: ${recipe.prep_time}min` : ''}
        ${recipe.cook_time ? ` | Cook: ${recipe.cook_time}min` : ''}
      </div>
    </div>
    
    ${ingredients.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Ingredients</h2>
        <ul class="ingredients">
          ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${instructions.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Instructions</h2>
        <ol class="instructions">
          ${instructions.map(instruction => `<li>${instruction}</li>`).join('')}
        </ol>
      </div>
    ` : ''}
    
    ${recipe.converted_recipe ? `
      <div class="section">
        <h2 class="section-title">Recipe</h2>
        <div>${recipe.converted_recipe.replace(/\n/g, '<br>')}</div>
      </div>
    ` : ''}
  `;
};

const generateDownloadableRecipe = (recipe: any): string => {
  const ingredients = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients 
    : typeof recipe.ingredients === 'string' 
    ? recipe.ingredients.split('\n') 
    : [];

  const instructions = recipe.instructions || [];
  
  let content = `${recipe.title}\n`;
  content += `${'='.repeat(recipe.title.length)}\n\n`;
  
  if (recipe.servings || recipe.prep_time || recipe.cook_time) {
    content += `Recipe Info:\n`;
    if (recipe.servings) content += `Servings: ${recipe.servings}\n`;
    if (recipe.prep_time) content += `Prep Time: ${recipe.prep_time} minutes\n`;
    if (recipe.cook_time) content += `Cook Time: ${recipe.cook_time} minutes\n`;
    content += `\n`;
  }
  
  if (ingredients.length > 0) {
    content += `Ingredients:\n`;
    ingredients.forEach(ingredient => {
      content += `• ${ingredient}\n`;
    });
    content += `\n`;
  }
  
  if (instructions.length > 0) {
    content += `Instructions:\n`;
    instructions.forEach((instruction, index) => {
      content += `${index + 1}. ${instruction}\n`;
    });
    content += `\n`;
  }
  
  if (recipe.converted_recipe) {
    content += `Recipe Details:\n`;
    content += `${recipe.converted_recipe}\n\n`;
  }
  
  content += `\n---\nGenerated by Gluten World\n`;
  
  return content;
};

// Mobile-optimized print content (plain text for sharing/printing)
const generateMobilePrintContent = (recipe: any): string => {
  let content = `📄 ${recipe.title}\n`;
  content += `${'─'.repeat(30)}\n\n`;
  
  if (recipe.servings || recipe.prep_time || recipe.cook_time) {
    content += `📋 RECIPE INFO:\n`;
    if (recipe.servings) content += `• Servings: ${recipe.servings}\n`;
    if (recipe.prep_time) content += `• Prep Time: ${recipe.prep_time} minutes\n`;
    if (recipe.cook_time) content += `• Cook Time: ${recipe.cook_time} minutes\n`;
    content += `\n`;
  }
  
  const ingredients = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients 
    : typeof recipe.ingredients === 'string' 
    ? recipe.ingredients.split('\n') 
    : [];
    
  if (ingredients.length > 0) {
    content += `🥄 INGREDIENTS:\n`;
    ingredients.forEach(ingredient => {
      content += `• ${ingredient}\n`;
    });
    content += `\n`;
  }
  
  const instructions = recipe.instructions || [];
  if (instructions.length > 0) {
    content += `👩‍🍳 INSTRUCTIONS:\n`;
    instructions.forEach((instruction, index) => {
      content += `${index + 1}. ${instruction}\n`;
    });
    content += `\n`;
  }
  
  if (recipe.converted_recipe) {
    content += `📝 RECIPE DETAILS:\n`;
    content += `${recipe.converted_recipe}\n\n`;
  }
  
  if (recipe.calories_per_serving || recipe.protein_g || recipe.carbs_g || recipe.fat_g) {
    content += `📊 NUTRITION (per serving):\n`;
    if (recipe.calories_per_serving) content += `• Calories: ${recipe.calories_per_serving}\n`;
    if (recipe.protein_g) content += `• Protein: ${recipe.protein_g}g\n`;
    if (recipe.carbs_g) content += `• Carbs: ${recipe.carbs_g}g\n`;
    if (recipe.fat_g) content += `• Fat: ${recipe.fat_g}g\n`;
    content += `\n`;
  }
  
  content += `✨ From Gluten World App\n`;
  content += `📱 Your gluten-free recipe companion`;
  
  return content;
};

const generateShareableRecipe = (recipe: any): string => {
  let content = `🍴 ${recipe.title}\n\n`;
  
  if (recipe.servings || recipe.prep_time || recipe.cook_time) {
    content += `📋 `;
    if (recipe.servings) content += `Serves ${recipe.servings} `;
    if (recipe.prep_time) content += `| Prep: ${recipe.prep_time}min `;
    if (recipe.cook_time) content += `| Cook: ${recipe.cook_time}min`;
    content += `\n\n`;
  }
  
  if (recipe.converted_recipe) {
    content += `${recipe.converted_recipe.substring(0, 300)}...\n\n`;
  }
  
  content += `✨ Generated by Gluten World - Your gluten-free recipe companion!`;
  
  return content;
};

export default MobileRecipeActions;