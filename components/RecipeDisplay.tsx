'use client';

import { useState } from 'react';
import { Recipe } from '@/types/recipe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface RecipeDisplayProps {
  recipe: Recipe;
  onSave?: (recipe: Recipe) => void;
  isSaving?: boolean;
  showSaveButton?: boolean;
}

export default function RecipeDisplay({ 
  recipe, 
  onSave, 
  isSaving = false, 
  showSaveButton = true 
}: RecipeDisplayProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-gray-900">
          {recipe.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recipe Image */}
        {recipe.image_url && !imageError && (
          <div className="w-full h-64 relative rounded-lg overflow-hidden">
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients_list.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nutrition */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Nutrition Info</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{recipe.nutrition.calories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{recipe.nutrition.protein}</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{recipe.nutrition.carbs}</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{recipe.nutrition.fat}</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
          <ol className="space-y-3">
            {recipe.steps_list.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </span>
                <span className="text-gray-700 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* YouTube Video */}
        {recipe.video_url && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Video Tutorial</h3>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src={recipe.video_url}
                title="Recipe Tutorial"
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Save Button */}
        {showSaveButton && onSave && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => onSave(recipe)}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
            >
              {isSaving ? 'Saving...' : 'Save Recipe'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}