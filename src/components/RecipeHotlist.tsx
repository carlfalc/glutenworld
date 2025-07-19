
import { TrendingUp, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useMostConvertedRecipes } from '@/hooks/useRecipes';

const RecipeHotlist = () => {
  const { data: hotRecipes = [], isLoading } = useMostConvertedRecipes();

  return (
    <div className="p-4">
      <div className="pb-4 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gluten-primary" />
          Recipe Hotlist
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Most converted recipes today</p>
      </div>
      
      <div className="max-h-64 sm:max-h-80 overflow-y-auto space-y-3 mt-4">
        {isLoading ? (
          <div className="text-sm text-muted-foreground text-center py-4">Loading recipes...</div>
        ) : hotRecipes.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">No public recipes yet.</div>
        ) : (
          hotRecipes.map((recipe, index) => (
            <Card 
              key={recipe.id} 
              className="bg-card/30 border-border/30 hover:bg-card/50 transition-colors cursor-pointer group"
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-foreground group-hover:text-gluten-primary transition-colors line-clamp-2 pr-2">
                    {recipe.title}
                  </h3>
                  {index < 3 && (
                    <TrendingUp className="w-4 h-4 text-gluten-primary flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{recipe.conversion_count} conversions</span>
                  </div>
                  {recipe.cook_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{recipe.cook_time} min</span>
                    </div>
                  )}
                  {recipe.difficulty_level && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      recipe.difficulty_level === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      recipe.difficulty_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {recipe.difficulty_level}
                    </span>
                  )}
                </div>
                
                <div className="mt-2 pt-2 border-t border-border/20">
                  <div className="text-xs text-muted-foreground">
                    #{index + 1} most converted
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="text-xs text-muted-foreground text-center">
          Updated every hour • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default RecipeHotlist;
