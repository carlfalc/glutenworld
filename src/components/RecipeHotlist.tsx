
import { TrendingUp, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const RecipeHotlist = () => {
  const hotRecipes = [
    {
      id: 1,
      name: "Gluten-Free Chocolate Chip Cookies",
      conversions: 1234,
      time: "25 min",
      difficulty: "Easy",
      trending: true
    },
    {
      id: 2,
      name: "Perfect Gluten-Free Pizza Dough",
      conversions: 987,
      time: "45 min",
      difficulty: "Medium",
      trending: true
    },
    {
      id: 3,
      name: "Fluffy Gluten-Free Pancakes",
      conversions: 856,
      time: "15 min",
      difficulty: "Easy",
      trending: false
    },
    {
      id: 4,
      name: "Classic Gluten-Free Bread",
      conversions: 742,
      time: "3 hrs",
      difficulty: "Hard",
      trending: false
    }
  ];

  return (
    <div className="p-4">
      <div className="pb-4 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gluten-primary" />
          Recipe Hotlist
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Most converted recipes today</p>
      </div>
      
      <div className="space-y-3 mt-4">
        {hotRecipes.map((recipe, index) => (
          <Card 
            key={recipe.id} 
            className="bg-card/30 border-border/30 hover:bg-card/50 transition-colors cursor-pointer group"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground group-hover:text-gluten-primary transition-colors line-clamp-2">
                  {recipe.name}
                </h3>
                {recipe.trending && (
                  <TrendingUp className="w-4 h-4 text-gluten-primary flex-shrink-0 ml-2" />
                )}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{recipe.conversions}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{recipe.time}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  recipe.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                  recipe.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {recipe.difficulty}
                </span>
              </div>
              
              <div className="mt-2 pt-2 border-t border-border/20">
                <div className="text-xs text-muted-foreground">
                  #{index + 1} most converted
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
