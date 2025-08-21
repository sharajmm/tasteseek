'use client';

import { useState } from 'react';
import { Recipe } from '@/types/recipe';
import RecipeForm from '@/components/RecipeForm';
import RecipeDisplay from '@/components/RecipeDisplay';

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerateRecipe = async (data: {
    ingredients: string;
    mealType: string;
    dietaryFilters: string[];
  }) => {
    setIsLoading(true);
    
    try {
      // Generate recipe
      const recipeResponse = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!recipeResponse.ok) {
        throw new Error('Failed to generate recipe');
      }

      const recipeData = await recipeResponse.json();

      // Search for image
      const imageResponse = await fetch('/api/search-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: recipeData.title }),
      });

      const imageData = await imageResponse.json();

      // Search for video
      const videoResponse = await fetch('/api/search-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: recipeData.title }),
      });

      const videoData = await videoResponse.json();

      const completeRecipe: Recipe = {
        ...recipeData,
        image_url: imageData.image_url,
        video_url: videoData.video_url,
      };

      setRecipe(completeRecipe);
    } catch (error) {
      console.error('Error generating recipe:', error);
      alert('Failed to generate recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = async (recipeToSave: Recipe) => {
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/save-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeToSave),
      });

      if (!response.ok) {
        throw new Error('Failed to save recipe');
      }

      alert('Recipe saved successfully!');
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Turn Your Ingredients Into Amazing Recipes
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Simply enter your available ingredients and let our AI create personalized recipes just for you.
        </p>
      </div>

      <RecipeForm onSubmit={handleGenerateRecipe} isLoading={isLoading} />

      {recipe && (
        <div className="mt-12">
          <RecipeDisplay 
            recipe={recipe} 
            onSave={handleSaveRecipe}
            isSaving={isSaving}
          />
        </div>
      )}
    </div>
  );
}