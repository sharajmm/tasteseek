"use client";

import { useState, useEffect } from "react";
import { Recipe } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecipeDisplay from "@/components/RecipeDisplay";
import Image from "next/image";

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("/api/get-recipes");
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    setIsDeleting(id);

    try {
      const response = await fetch("/api/delete-recipe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
        if (selectedRecipe?.id === id) {
          setSelectedRecipe(null);
        }
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (selectedRecipe) {
    // Helper to download recipe as txt
    const handleDownloadTxt = () => {
      const txt = `Title: ${
        selectedRecipe.title
      }\n\nIngredients:\n${selectedRecipe.ingredients_list.join(
        "\n"
      )}\n\nSteps:\n${selectedRecipe.steps_list.join(
        "\n"
      )}\n\nNutrition:\n${Object.entries(selectedRecipe.nutrition || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")}`;
      const blob = new Blob([txt], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedRecipe.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex gap-4">
          <Button
            onClick={() => setSelectedRecipe(null)}
            className="bg-gray-600 hover:bg-gray-700"
          >
            ← Back to Saved Recipes
          </Button>
          <Button
            onClick={handleDownloadTxt}
            className="bg-green-600 hover:bg-green-700"
          >
            Download as TXT
          </Button>
        </div>
        <RecipeDisplay recipe={selectedRecipe} showSaveButton={false} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Recipes</h1>
        <p className="text-gray-600">Your collection of favorite recipes</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading saved recipes...</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No saved recipes yet.</p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Generate Your First Recipe
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {recipe.image_url && (
                <div className="w-full h-48 relative">
                  <Image
                    src={recipe.image_url}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{recipe.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-4">
                  {recipe.ingredients_list.length} ingredients •{" "}
                  {recipe.steps_list.length} steps
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setSelectedRecipe(recipe)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    View Recipe
                  </Button>
                  <Button
                    onClick={() => handleDeleteRecipe(recipe.id!)}
                    disabled={isDeleting === recipe.id}
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    {isDeleting === recipe.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
