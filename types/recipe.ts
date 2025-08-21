export interface Recipe {
  id?: string;
  title: string;
  ingredients_list: string[];
  steps_list: string[];
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  image_url?: string;
  video_url?: string;
  created_at?: Date;
}

export interface RecipeRequest {
  ingredients: string;
  mealType: string;
  dietaryFilters: string[];
}