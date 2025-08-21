import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const recipe = await request.json();
    // Only keep text fields
    const safeRecipe = {
      title: recipe.title || "",
      ingredients_list: Array.isArray(recipe.ingredients_list)
        ? recipe.ingredients_list
        : [],
      steps_list: Array.isArray(recipe.steps_list) ? recipe.steps_list : [],
      nutrition:
        typeof recipe.nutrition === "object" && recipe.nutrition !== null
          ? recipe.nutrition
          : {
              calories: "",
              protein: "",
              carbs: "",
              fat: "",
            },
      created_at: new Date(),
    };

    const docRef = await addDoc(collection(db, "recipes"), safeRecipe);

    return NextResponse.json({
      success: true,
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error saving recipe:", error);
    return NextResponse.json(
      { error: "Failed to save recipe" },
      { status: 500 }
    );
  }
}
