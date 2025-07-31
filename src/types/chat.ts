export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  mode?: string;
  image?: string;
  convertedRecipe?: string;
  ingredientAnalysis?: {
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
  };
}