import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Users, ChefHat, X, Share, Printer, Download } from 'lucide-react';
import { DatabaseRecipe } from '@/hooks/useRecipeSearch';
import ShareRecipe from "./ShareRecipe";
import { toast } from "@/hooks/use-toast";

interface SimpleRecipeModalProps {
  recipe: DatabaseRecipe | null;
  isOpen: boolean;
  onClose: () => void;
}

const SimpleRecipeModal = ({ recipe, isOpen, onClose }: SimpleRecipeModalProps) => {
  const [showShareModal, setShowShareModal] = useState(false);
  
  if (!recipe) return null;

  const totalTime = recipe.cook_time ? (recipe.prep_time || 0) + recipe.cook_time : (recipe.prep_time || 0);
  
  // Get the full recipe content
  const fullRecipeText = recipe.converted_recipe || recipe.original_recipe || "";
  
  // Debug logging to see what's in the recipe
  console.log("Recipe data:", {
    title: recipe.title,
    converted_recipe: recipe.converted_recipe,
    original_recipe: recipe.original_recipe,
    fullRecipeText: fullRecipeText,
    instructions: recipe.instructions,
    ingredients: recipe.ingredients
  });
  
  // Helper function to format the recipe text for display
  const formatRecipeContent = (text: string) => {
    if (!text) return "A delicious gluten-free recipe.";
    
    // Split the text into paragraphs and format them
    const paragraphs = text.split('\n').filter(line => line.trim());
    
    return paragraphs.map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;
      
      // Handle different types of content
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        // This is a header
        return (
          <h4 key={index} className="text-lg font-semibold mt-6 mb-3 text-primary">
            {trimmed.replace(/\*\*/g, '')}
          </h4>
        );
      } else if (trimmed.startsWith('✅') || trimmed.startsWith('🥄') || trimmed.startsWith('🔥') || trimmed.startsWith('📊') || trimmed.startsWith('🍽️') || trimmed.startsWith('⏱️')) {
        // This is a special formatted line
        return (
          <div key={index} className="flex items-start gap-2 mb-2 p-3 bg-muted/30 rounded-lg">
            <span className="text-lg flex-shrink-0">{trimmed.charAt(0)}</span>
            <span className="flex-1">{trimmed.substring(1).trim()}</span>
          </div>
        );
      } else if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
        // This is a list item (ingredients)
        return (
          <div key={index} className="flex items-start gap-2 mb-2 ml-2 p-2 bg-muted/20 rounded">
            <span className="text-primary font-bold flex-shrink-0">•</span>
            <span className="flex-1">{trimmed.substring(1).trim()}</span>
          </div>
        );
      } else if (/^\d+\./.test(trimmed)) {
        // This is a numbered step (cooking instructions)
        const stepMatch = trimmed.match(/^(\d+)\.\s*(.+)/);
        if (stepMatch) {
          return (
            <div key={index} className="flex gap-3 p-4 mb-3 bg-primary/10 border-l-4 border-primary rounded-r-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                {stepMatch[1]}
              </div>
              <p className="flex-1 text-foreground leading-relaxed">{stepMatch[2]}</p>
            </div>
          );
        }
      }
      
      // Regular paragraph
      return (
        <p key={index} className="mb-3 text-muted-foreground leading-relaxed">
          {trimmed}
        </p>
      );
    }).filter(Boolean);
  };

  const handlePrint = () => {
    const printContent = generatePrintableRecipe(recipe);
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Recipe - ${recipe.title}</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                line-height: 1.6;
                color: #333;
              }
              .recipe-header {
                text-align: center;
                border-bottom: 3px solid #e67e22;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .recipe-title {
                font-size: 2.5em;
                color: #2c3e50;
                margin-bottom: 10px;
                font-weight: bold;
              }
              .recipe-info {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin: 20px 0;
                flex-wrap: wrap;
              }
              .info-item {
                background: #f8f9fa;
                padding: 10px 15px;
                border-radius: 8px;
                border-left: 4px solid #e67e22;
              }
              .section {
                margin: 30px 0;
                page-break-inside: avoid;
              }
              .section-title {
                font-size: 1.5em;
                color: #e67e22;
                border-bottom: 2px solid #e67e22;
                padding-bottom: 8px;
                margin-bottom: 15px;
              }
              .ingredients-list, .instructions-list {
                padding-left: 0;
              }
              .ingredients-list li, .instructions-list li {
                margin: 8px 0;
                padding: 8px;
                background: #f8f9fa;
                border-radius: 4px;
                list-style: none;
                position: relative;
                padding-left: 25px;
              }
              .ingredients-list li:before {
                content: "•";
                color: #e67e22;
                font-weight: bold;
                position: absolute;
                left: 8px;
              }
              .instructions-list li {
                counter-increment: step-counter;
                padding-left: 35px;
              }
              .instructions-list li:before {
                content: counter(step-counter);
                background: #e67e22;
                color: white;
                padding: 2px 8px;
                border-radius: 50%;
                font-size: 0.9em;
                font-weight: bold;
                position: absolute;
                left: 8px;
                top: 8px;
              }
              .instructions-list {
                counter-reset: step-counter;
              }
              .nutrition-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 15px;
              }
              .nutrition-item {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                border-top: 3px solid #e67e22;
              }
              .nutrition-label {
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 5px;
              }
              .nutrition-value {
                font-size: 1.2em;
                color: #e67e22;
              }
              @media print {
                body { margin: 0; padding: 20px; }
                .recipe-info { flex-direction: column; align-items: center; }
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
      description: "Recipe has been saved to your downloads.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[calc(90vh-2rem)] flex flex-col p-0">
        <div className="flex-shrink-0 p-6 pb-0">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-2xl font-bold">{recipe.title}</DialogTitle>
            <div className="flex items-center gap-2">
              {/* Action Buttons */}
              <div className="flex gap-2">
                <ShareRecipe 
                  recipe={recipe.original_recipe || recipe.converted_recipe || formatRecipeForSharing(recipe)} 
                  title={recipe.title}
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
                >
                  <Printer className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
        </div>
        
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
          <div className="space-y-6 pb-6">
            {/* Recipe Info */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{totalTime} min</div>
                  <div className="text-sm text-muted-foreground">Total Time</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{recipe.servings || 1}</div>
                  <div className="text-sm text-muted-foreground">Servings</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{recipe.difficulty_level || 'Medium'}</div>
                  <div className="text-sm text-muted-foreground">Difficulty</div>
                </div>
              </div>
            </div>

            {/* Full Recipe Content */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Complete Recipe</h3>
              <div className="space-y-2">
                {formatRecipeContent(fullRecipeText)}
              </div>
            </div>

            {/* Ingredients - Only show if structured data exists */}
            {recipe.ingredients && Array.isArray(recipe.ingredients) && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Ingredients (Structured)</h3>
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/20 rounded">
                      <span className="font-medium">{ingredient.amount} {ingredient.unit}</span>
                      <span>{ingredient.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions - Only show if structured data exists */}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Instructions (Structured)</h3>
                <div className="space-y-3">
                  {recipe.instructions.map((instruction: string, index: number) => (
                    <div key={index} className="flex gap-3 p-3 bg-muted/20 rounded">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="flex-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition */}
            {recipe.calories_per_serving && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Nutrition (per serving)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-muted/20 rounded text-center">
                    <div className="font-bold text-lg">{recipe.calories_per_serving}</div>
                    <div className="text-sm text-muted-foreground">Calories</div>
                  </div>
                  {recipe.protein_g && (
                    <div className="p-3 bg-muted/20 rounded text-center">
                      <div className="font-bold text-lg">{recipe.protein_g}g</div>
                      <div className="text-sm text-muted-foreground">Protein</div>
                    </div>
                  )}
                  {recipe.carbs_g && (
                    <div className="p-3 bg-muted/20 rounded text-center">
                      <div className="font-bold text-lg">{recipe.carbs_g}g</div>
                      <div className="text-sm text-muted-foreground">Carbs</div>
                    </div>
                  )}
                  {recipe.fat_g && (
                    <div className="p-3 bg-muted/20 rounded text-center">
                      <div className="font-bold text-lg">{recipe.fat_g}g</div>
                      <div className="text-sm text-muted-foreground">Fat</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0 p-6 pt-4 border-t">
          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper functions for printing and downloading
const generatePrintableRecipe = (recipe: any): string => {
  const ingredients = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients 
    : typeof recipe.ingredients === 'string' 
    ? recipe.ingredients.split('\n') 
    : [];

  const instructions = recipe.instructions || [];

  let content = `
    <div class="recipe-header">
      <h1 class="recipe-title">${recipe.title}</h1>
      <div class="recipe-info">
        ${recipe.servings ? `<div class="info-item"><strong>Servings:</strong> ${recipe.servings}</div>` : ''}
        ${recipe.prep_time ? `<div class="info-item"><strong>Prep Time:</strong> ${recipe.prep_time} minutes</div>` : ''}
        ${recipe.cook_time ? `<div class="info-item"><strong>Cook Time:</strong> ${recipe.cook_time} minutes</div>` : ''}
        ${recipe.difficulty_level ? `<div class="info-item"><strong>Difficulty:</strong> ${recipe.difficulty_level}</div>` : ''}
      </div>
    </div>
  `;

  if (ingredients.length > 0) {
    content += `
      <div class="section">
        <h2 class="section-title">🥄 Ingredients</h2>
        <ul class="ingredients-list">
          ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (instructions.length > 0) {
    content += `
      <div class="section">
        <h2 class="section-title">👨‍🍳 Instructions</h2>
        <ol class="instructions-list">
          ${instructions.map(instruction => `<li>${instruction}</li>`).join('')}
        </ol>
      </div>
    `;
  }

  // Add nutrition information if available
  const nutritionFields = [
    { key: 'calories_per_serving', label: 'Calories' },
    { key: 'protein_g', label: 'Protein (g)' },
    { key: 'carbs_g', label: 'Carbs (g)' },
    { key: 'fat_g', label: 'Fat (g)' },
    { key: 'fiber_g', label: 'Fiber (g)' },
    { key: 'sugar_g', label: 'Sugar (g)' },
    { key: 'sodium_mg', label: 'Sodium (mg)' }
  ];

  const nutritionItems = nutritionFields
    .filter(field => recipe[field.key] != null)
    .map(field => `
      <div class="nutrition-item">
        <div class="nutrition-label">${field.label}</div>
        <div class="nutrition-value">${recipe[field.key]}</div>
      </div>
    `);

  if (nutritionItems.length > 0) {
    content += `
      <div class="section">
        <h2 class="section-title">📊 Nutrition Information</h2>
        <div class="nutrition-grid">
          ${nutritionItems.join('')}
        </div>
      </div>
    `;
  }

  content += `
    <div style="margin-top: 40px; text-align: center; font-style: italic; color: #666;">
      ✨ Generated by Gluten World - Your gluten-free recipe companion!
    </div>
  `;

  return content;
};

const generateDownloadableRecipe = (recipe: any): string => {
  let content = `${recipe.title}\n`;
  content += `${'='.repeat(recipe.title.length)}\n\n`;
  
  if (recipe.servings || recipe.prep_time || recipe.cook_time || recipe.difficulty_level) {
    content += `RECIPE INFO:\n`;
    if (recipe.servings) content += `• Servings: ${recipe.servings}\n`;
    if (recipe.prep_time) content += `• Prep Time: ${recipe.prep_time} minutes\n`;
    if (recipe.cook_time) content += `• Cook Time: ${recipe.cook_time} minutes\n`;
    if (recipe.difficulty_level) content += `• Difficulty: ${recipe.difficulty_level}\n`;
    content += `\n`;
  }

  const ingredients = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients 
    : typeof recipe.ingredients === 'string' 
    ? recipe.ingredients.split('\n') 
    : [];

  if (ingredients.length > 0) {
    content += `INGREDIENTS:\n`;
    ingredients.forEach(ingredient => {
      content += `• ${ingredient}\n`;
    });
    content += `\n`;
  }

  const instructions = recipe.instructions || [];
  if (instructions.length > 0) {
    content += `INSTRUCTIONS:\n`;
    instructions.forEach((instruction, index) => {
      content += `${index + 1}. ${instruction}\n`;
    });
    content += `\n`;
  }

  // Add nutrition information if available
  const nutritionFields = [
    { key: 'calories_per_serving', label: 'Calories per serving' },
    { key: 'protein_g', label: 'Protein' },
    { key: 'carbs_g', label: 'Carbohydrates' },
    { key: 'fat_g', label: 'Fat' },
    { key: 'fiber_g', label: 'Fiber' },
    { key: 'sugar_g', label: 'Sugar' },
    { key: 'sodium_mg', label: 'Sodium' }
  ];

  const nutritionInfo = nutritionFields
    .filter(field => recipe[field.key] != null)
    .map(field => `• ${field.label}: ${recipe[field.key]}${field.key.includes('_g') ? 'g' : field.key.includes('_mg') ? 'mg' : ''}`)
    .join('\n');

  if (nutritionInfo) {
    content += `NUTRITION INFORMATION:\n${nutritionInfo}\n\n`;
  }

  content += `---\nGenerated by Gluten World\nYour gluten-free recipe companion!`;
  
  return content;
};

const formatRecipeForSharing = (recipe: any): string => {
  let content = `${recipe.title}\n\n`;
  
  if (recipe.servings || recipe.prep_time || recipe.cook_time) {
    content += `Recipe Info:\n`;
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
    content += `Ingredients:\n`;
    ingredients.forEach(ingredient => {
      content += `• ${ingredient}\n`;
    });
    content += `\n`;
  }

  const instructions = recipe.instructions || [];
  if (instructions.length > 0) {
    content += `Instructions:\n`;
    instructions.forEach((instruction, index) => {
      content += `${index + 1}. ${instruction}\n`;
    });
  }

  return content;
};

export default SimpleRecipeModal;