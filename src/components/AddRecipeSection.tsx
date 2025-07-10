
import { useState } from 'react';
import { Camera, FileText, ArrowRight, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useCreateRecipe } from '@/hooks/useRecipes';
import { useRecipeConversion } from '@/hooks/useRecipeConversion';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ImageCapture from '@/components/ImageCapture';
import RecipeConversionResult from '@/components/RecipeConversionResult';
import FeatureDetailsPopup from '@/components/FeatureDetailsPopup';
import { useRecipeConsistencyFix } from '@/hooks/useRecipeConsistencyFix';
import { toast } from '@/hooks/use-toast';

const AddRecipeSection = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showImageCapture, setShowImageCapture] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [showFeatureDetails, setShowFeatureDetails] = useState(false);
  
  const createRecipeMutation = useCreateRecipe();
  const recipeConversionMutation = useRecipeConversion();
  const { fixRecipeConsistency, isFixing } = useRecipeConsistencyFix();
  
  const form = useForm({
    defaultValues: {
      title: '',
      original_recipe: '',
      difficulty_level: 'Easy' as 'Easy' | 'Medium' | 'Hard',
      is_public: false
    }
  });

  const onSubmit = async (values: any) => {
    try {
      await createRecipeMutation.mutateAsync(values);
      form.reset();
      setOpen(false);
      toast({
        title: "Recipe Added!",
        description: "Your recipe has been saved successfully.",
      });
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageCapture = async (imageBase64: string, source: 'camera' | 'upload' | 'screenshot') => {
    setIsConverting(true);
    try {
      const result = await recipeConversionMutation.mutateAsync({
        imageBase64,
        prompt: "Analyze this recipe image and convert it to a detailed gluten-free version with exact substitutions and instructions."
      });
      
      setConversionResult(result.convertedRecipe);
      setShowImageCapture(false);
    } catch (error) {
      console.error('Error converting recipe:', error);
      toast({
        title: "Conversion Error",
        description: "Failed to convert recipe. Please try again.",
        variant: "destructive",
      });
      setShowImageCapture(false);
    } finally {
      setIsConverting(false);
    }
  };

  const handleBackFromResult = () => {
    setConversionResult(null);
  };

  const handleSaveFromResult = () => {
    setConversionResult(null);
    setOpen(false);
  };

  const handleScanClick = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to use the recipe scanning feature.",
        variant: "default",
      });
      return;
    }
    setShowImageCapture(true);
  };

  return (
    <div className="p-4">
      <div className="pb-4 border-b border-border/50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">Add recipe or convert without Gluten</h2>
            <p className="text-sm text-muted-foreground mt-1">Convert your favourite recipe with Gluten now without Gluten or check the ingredients in your recipe</p>
          </div>
          <Button
            onClick={() => setShowFeatureDetails(true)}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 flex items-center gap-2"
          >
            <Info className="w-4 h-4" />
            See More
          </Button>
        </div>
      </div>
      
      <div className="space-y-3 mt-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Card className="bg-card/30 border-border/30 hover:bg-card/50 transition-colors cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-gluten-primary/10 rounded-full">
                    <Camera className="w-8 h-8 text-gluten-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-gluten-primary transition-colors">
                      Scan Recipe
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use camera to scan your recipe
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {conversionResult ? 'Recipe Converted' : showImageCapture ? 'Scan Recipe' : 'Add New Recipe'}
              </DialogTitle>
            </DialogHeader>
            
            {isConverting ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gluten-primary mx-auto mb-4"></div>
                <h3 className="font-medium mb-2">Converting Recipe...</h3>
                <p className="text-sm text-muted-foreground">AI is analyzing your recipe and creating a gluten-free version</p>
              </div>
            ) : conversionResult ? (
              <RecipeConversionResult
                convertedRecipe={conversionResult}
                onBack={handleBackFromResult}
                onSave={handleSaveFromResult}
              />
            ) : showImageCapture ? (
              <ImageCapture
                onImageCapture={handleImageCapture}
                onClose={() => setShowImageCapture(false)}
                type="recipe"
              />
            ) : (
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="manual">Manual</TabsTrigger>
                  <TabsTrigger value="scan">Scan</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                
                <TabsContent value="manual">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipe Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter recipe title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="original_recipe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipe Details</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Paste or type your recipe here" 
                                {...field} 
                                rows={6}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="difficulty_level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Difficulty</FormLabel>
                            <div className="flex space-x-2">
                              {['Easy', 'Medium', 'Hard'].map((level) => (
                                <Button
                                  key={level}
                                  type="button"
                                  size="sm"
                                  variant={field.value === level ? 'default' : 'outline'}
                                  onClick={() => form.setValue('difficulty_level', level as 'Easy' | 'Medium' | 'Hard')}
                                  className={field.value === level ? 'bg-gluten-primary text-white' : ''}
                                >
                                  {level}
                                </Button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="is_public"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) => form.setValue('is_public', e.target.checked)}
                                className="h-4 w-4"
                              />
                            </FormControl>
                            <FormLabel className="text-sm m-0">Make recipe public</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gluten-primary" 
                        disabled={createRecipeMutation.isPending}
                      >
                        {createRecipeMutation.isPending ? 'Saving...' : 'Save Recipe'} <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="scan">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-4 bg-gluten-primary/10 rounded-full mb-4">
                      <Camera className="w-10 h-10 text-gluten-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Scan a Recipe</h3>
                    <p className="text-sm text-muted-foreground mb-4">Position your camera over a recipe to scan it</p>
                    <Button 
                      type="button" 
                      onClick={handleScanClick}
                      className="bg-gluten-primary"
                    >
                      Start Camera
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="upload">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-4 bg-gluten-primary/10 rounded-full mb-4">
                      <FileText className="w-10 h-10 text-gluten-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Upload a Recipe File</h3>
                    <p className="text-sm text-muted-foreground mb-4">Select a PDF or image file of your recipe</p>
                    <Button 
                      type="button" 
                      onClick={handleScanClick}
                      className="bg-gluten-primary"
                    >
                      Choose File
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
        
        {user?.email === 'admin@glutenworld.com' && (
          <Button
            onClick={fixRecipeConsistency}
            disabled={isFixing}
            className="w-full mt-3 bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isFixing ? 'Fixing Recipe Consistency...' : 'Fix Recipe Consistency (Admin)'}
          </Button>
        )}
        
        {!user && (
          <div className="text-xs text-center text-muted-foreground mt-4">
            Sign in to add and save recipes
          </div>
        )}
      </div>

      <FeatureDetailsPopup 
        open={showFeatureDetails} 
        onOpenChange={setShowFeatureDetails}
        isFromLanding={false}
      />
    </div>
  );
};

export default AddRecipeSection;
