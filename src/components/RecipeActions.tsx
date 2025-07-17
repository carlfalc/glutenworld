import { useState } from 'react';
import { Heart, Share, Printer, Download, Save, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useCreateRecipe, useRecipes, useDeleteRecipe } from '@/hooks/useRecipes';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ShareRecipe from './ShareRecipe';
import { cn } from '@/lib/utils';

interface RecipeActionsProps {
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
  size?: 'sm' | 'default' | 'lg';
}

const RecipeActions = ({ recipe, className, size = 'default' }: RecipeActionsProps) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { toast } = useToast();
  
  const createRecipeMutation = useCreateRecipe();
  const deleteRecipeMutation = useDeleteRecipe();
  const { data: userRecipes, isLoading: recipesLoading } = useRecipes();
  const { user, loading: authLoading } = useAuth();
  
  // Check if recipe exists in My Recipes - for newly generated recipes, check by ID first, then content
  const isFav = userRecipes?.some(r => {
    // If the recipe has an ID that matches a user recipe, it's already saved
    if (recipe.id && r.id === recipe.id) return true;
    
    // For generated recipes without ID, check by title and content
    return r.title === recipe.title && 
           r.converted_recipe === recipe.converted_recipe &&
           r.converted_recipe // Only match if there's actual content to compare
  }) || false;

  // Debug logging
  console.log('🔍 Recipe matching debug:', {
    recipeTitle: recipe.title,
    recipesCount: userRecipes?.length || 0,
    isFav,
    isAuthenticated: !!user,
    authLoading,
    recipesLoading,
    userRecipes: userRecipes?.map(r => ({ id: r.id, title: r.title }))
  });

  const handleFavoriteToggle = async () => {
    if (isFav) {
      // Remove from My Recipes
      const existingRecipe = userRecipes?.find(r => 
        r.title === recipe.title && 
        (r.converted_recipe === recipe.converted_recipe || r.original_recipe === recipe.original_recipe)
      );
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
      // Save recipe to My Recipes - ensure we have required fields
      const recipeData = {
        title: recipe.title || 'Untitled Recipe',
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

      console.log('🍳 Saving recipe data:', recipeData);

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
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                line-height: 1.6;
                color: #333;
              }
              .recipe-header { 
                border-bottom: 2px solid #333; 
                padding-bottom: 10px; 
                margin-bottom: 20px; 
              }
              .recipe-title { 
                font-size: 24px; 
                font-weight: bold; 
                margin: 0; 
              }
              .recipe-info { 
                margin: 10px 0; 
                display: flex; 
                gap: 20px; 
                flex-wrap: wrap;
              }
              .info-item { 
                font-size: 14px; 
                color: #666; 
              }
              .section { 
                margin: 20px 0; 
              }
              .section-title { 
                font-size: 18px; 
                font-weight: bold; 
                margin-bottom: 10px; 
                color: #444;
              }
              .ingredients { 
                list-style-type: disc; 
                margin-left: 20px; 
              }
              .instructions { 
                list-style-type: decimal; 
                margin-left: 20px; 
              }
              .ingredients li, .instructions li { 
                margin: 5px 0; 
              }
              .nutritional-info {
                background-color: #f5f5f5;
                padding: 15px;
                border-radius: 5px;
                margin-top: 20px;
              }
              .nutrition-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 10px;
                margin-top: 10px;
              }
              .nutrition-item {
                text-align: center;
                padding: 5px;
                background: white;
                border-radius: 3px;
              }
              @media print {
                body { margin: 0; }
                .recipe-header { page-break-after: avoid; }
              }
              @media screen and (max-width: 768px) {
                body { margin: 10px; font-size: 14px; }
                .recipe-title { font-size: 20px; }
                .section-title { font-size: 16px; }
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
  };

  const handleDownload = () => {
    const content = generateDownloadableRecipe(recipe);
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
      description: "Recipe has been saved to your device as a text file.",
    });
  };

  const handleShareToMessenger = () => {
    const recipeText = generateShareableRecipe(recipe);
    
    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: recipeText,
      }).catch((error) => {
        console.log('Error sharing:', error);
        // Fallback to copying to clipboard
        copyToClipboard(recipeText);
      });
    } else {
      // Fallback to copying to clipboard
      copyToClipboard(recipeText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Recipe Copied",
        description: "Recipe has been copied to clipboard. You can now paste it in any messenger app.",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Unable to copy recipe. Please try again.",
        variant: "destructive",
      });
    });
  };

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Favorite Button */}
      <Button
        variant="outline"
        size={buttonSize}
        onClick={handleFavoriteToggle}
        className={cn(
          "transition-all duration-200 touch-manipulation active:scale-95",
          isFav 
            ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100" 
            : "text-muted-foreground hover:bg-red-50 hover:border-red-200 hover:text-red-500"
        )}
        disabled={createRecipeMutation.isPending || deleteRecipeMutation.isPending}
      >
        <Heart className={cn("w-4 h-4", isFav ? "fill-current" : "")} />
        {size !== 'sm' && (isFav ? "Remove from My Recipes" : "Save to My Recipes")}
      </Button>

      {/* Share to Apps Button */}
      <Button
        variant="outline"
        size={buttonSize}
        onClick={handleShareToMessenger}
        className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
      >
        <MessageCircle className="w-4 h-4" />
        {size !== 'sm' && "Share to Apps"}
      </Button>

      {/* Print Button */}
      <Button
        variant="outline"
        size={buttonSize}
        onClick={handlePrint}
        className="hover:bg-green-50 hover:border-green-200 hover:text-green-600"
      >
        <Printer className="w-4 h-4" />
        {size !== 'sm' && "Print"}
      </Button>

      {/* Download Button */}
      <Button
        variant="outline"
        size={buttonSize}
        onClick={handleDownload}
        className="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600"
      >
        <Download className="w-4 h-4" />
        {size !== 'sm' && "Download"}
      </Button>

      {/* Share Recipe Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsShareOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
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

// Helper functions
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
        ${recipe.servings ? `<span class="info-item">Servings: ${recipe.servings}</span>` : ''}
        ${recipe.prep_time ? `<span class="info-item">Prep Time: ${recipe.prep_time} min</span>` : ''}
        ${recipe.cook_time ? `<span class="info-item">Cook Time: ${recipe.cook_time} min</span>` : ''}
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
        <h2 class="section-title">Recipe Details</h2>
        <div>${recipe.converted_recipe.replace(/\n/g, '<br>')}</div>
      </div>
    ` : ''}
    
    ${(recipe.calories_per_serving || recipe.protein_g || recipe.carbs_g || recipe.fat_g) ? `
      <div class="nutritional-info">
        <h3 class="section-title">Nutritional Information (per serving)</h3>
        <div class="nutrition-grid">
          ${recipe.calories_per_serving ? `<div class="nutrition-item"><strong>${recipe.calories_per_serving}</strong><br>Calories</div>` : ''}
          ${recipe.protein_g ? `<div class="nutrition-item"><strong>${recipe.protein_g}g</strong><br>Protein</div>` : ''}
          ${recipe.carbs_g ? `<div class="nutrition-item"><strong>${recipe.carbs_g}g</strong><br>Carbs</div>` : ''}
          ${recipe.fat_g ? `<div class="nutrition-item"><strong>${recipe.fat_g}g</strong><br>Fat</div>` : ''}
        </div>
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
  
  if (recipe.calories_per_serving || recipe.protein_g || recipe.carbs_g || recipe.fat_g) {
    content += `Nutritional Information (per serving):\n`;
    if (recipe.calories_per_serving) content += `Calories: ${recipe.calories_per_serving}\n`;
    if (recipe.protein_g) content += `Protein: ${recipe.protein_g}g\n`;
    if (recipe.carbs_g) content += `Carbs: ${recipe.carbs_g}g\n`;
    if (recipe.fat_g) content += `Fat: ${recipe.fat_g}g\n`;
  }
  
  content += `\n---\nGenerated by Gluten World\n`;
  
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

export default RecipeActions;