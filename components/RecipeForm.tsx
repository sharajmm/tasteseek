"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecipeFormProps {
  onSubmit: (data: {
    ingredients: string;
    mealType: string;
    dietaryFilters: string[];
  }) => void;
  isLoading: boolean;
}

const cuisineOptions = [
  "Indian",
  "Italian",
  "Chinese",
  "Mexican",
  "French",
  "Japanese",
  "Thai",
  "Mediterranean",
  "American",
  "Other",
];

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "high-protein", label: "High Protein" },
  { id: "low-carb", label: "Low Carb" },
];

export default function RecipeForm({ onSubmit, isLoading }: RecipeFormProps) {
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("");
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState("");
  const [recommendedFoods, setRecommendedFoods] = useState<string[]>([]);
  const [selectedFood, setSelectedFood] = useState<string>("");
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendError, setRecommendError] = useState("");

  const handleDietaryFilterChange = (filterId: string, checked: boolean) => {
    if (checked) {
      setDietaryFilters([...dietaryFilters, filterId]);
    } else {
      setDietaryFilters(dietaryFilters.filter((f) => f !== filterId));
    }
  };

  const handleRecommendFoods = async () => {
    setIsRecommending(true);
    setRecommendError("");
    setRecommendedFoods([]);
    setSelectedFood("");
    try {
      const res = await fetch("/api/recommend-foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuisine, ingredients }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.foods)) {
        setRecommendedFoods(data.foods);
      } else {
        setRecommendError(data.error || "Could not get recommendations.");
      }
    } catch (err) {
      setRecommendError("Network error.");
    } finally {
      setIsRecommending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFood && mealType) {
      onSubmit({ ingredients: selectedFood, mealType, dietaryFilters });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          Generate Your Recipe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              htmlFor="cuisine"
              className="text-sm font-medium text-gray-700"
            >
              Cuisine
            </Label>
            <Select value={cuisine} onValueChange={setCuisine} required>
              <SelectTrigger id="cuisine" className="mt-1">
                <SelectValue placeholder="Select cuisine" />
              </SelectTrigger>
              <SelectContent>
                {cuisineOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor="ingredients"
              className="text-sm font-medium text-gray-700"
            >
              Ingredients (separate with commas)
            </Label>
            <Input
              id="ingredients"
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="chicken, rice, tomato, onion..."
              className="mt-1"
              required
            />
          </div>
          <Button
            type="button"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium"
            disabled={isRecommending || !ingredients.trim() || !cuisine}
            onClick={handleRecommendFoods}
          >
            {isRecommending ? "Recommending..." : "Recommend Foods"}
          </Button>
          {recommendError && (
            <div className="text-red-600 text-sm">{recommendError}</div>
          )}
          {recommendedFoods.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Select a food to generate recipe:
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {recommendedFoods.map((food) => (
                  <Button
                    key={food}
                    type="button"
                    variant={selectedFood === food ? "default" : "outline"}
                    className={
                      selectedFood === food ? "bg-blue-600 text-white" : ""
                    }
                    onClick={() => setSelectedFood(food)}
                  >
                    {food}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div>
            <Label
              htmlFor="meal-type"
              className="text-sm font-medium text-gray-700"
            >
              Meal Type
            </Label>
            <Select value={mealType} onValueChange={setMealType} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
                <SelectItem value="dessert">Dessert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Dietary Filters (optional)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {dietaryOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={dietaryFilters.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleDietaryFilterChange(option.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={option.id}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
            disabled={isLoading || !selectedFood || !mealType}
          >
            {isLoading ? "Generating Recipe..." : "Generate Recipe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
