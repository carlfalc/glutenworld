
import { Camera, Barcode } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AddRecipeSection = () => {
  return (
    <div className="p-4">
      <div className="pb-4 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground">Add Recipe</h2>
        <p className="text-sm text-muted-foreground mt-1">Scan or capture your recipe</p>
      </div>
      
      <div className="space-y-3 mt-4">
        <Card className="bg-card/30 border-border/30 hover:bg-card/50 transition-colors cursor-pointer group">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gluten-primary/10 rounded-full">
                  <Barcode className="w-8 h-8 text-gluten-primary" />
                </div>
                <div className="p-3 bg-gluten-primary/10 rounded-full">
                  <Camera className="w-8 h-8 text-gluten-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground group-hover:text-gluten-primary transition-colors">
                  Scan Recipe
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Use barcode scanner or camera
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddRecipeSection;
