import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { ingredients, mealType, dietaryFilters } = await request.json();

    const dietaryText =
      dietaryFilters.length > 0
        ? `, dietary filters: ${dietaryFilters.join(", ")}`
        : "";

    const prompt = `You are a recipe generator. Given ingredients: ${ingredients}, meal type: ${mealType}${dietaryText}, suggest a recipe. 
Output only JSON in the following format:
{
  "title": "Recipe Name",
  "ingredients_list": ["ingredient 1", "ingredient 2"],
  "steps_list": ["step 1", "step 2"],
  "nutrition": {
    "calories": "300",
    "protein": "25g",
    "carbs": "30g",
    "fat": "10g"
  }
}`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate recipe");
    }

    const data = await response.json();
    const recipeText = data?.choices?.[0]?.message?.content;

    // Log raw response and its length for debugging
    if (typeof recipeText === "string") {
      console.log("Raw AI response:", recipeText);
      console.log("AI response length:", recipeText.length);
    }

    // Remove code fences if present
    let cleanedText = typeof recipeText === "string" ? recipeText.trim() : "";
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText
        .replace(/^```[a-zA-Z]*\s*/, "")
        .replace(/```$/, "")
        .trim();
    }

    // Extract JSON from the cleaned response
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        {
          error: "No valid JSON found in AI response",
          rawResponse: recipeText || data,
          responseLength: cleanedText.length,
        },
        { status: 500 }
      );
    }

    let recipe;
    try {
      recipe = JSON.parse(jsonMatch[0]);
    } catch (err) {
      return NextResponse.json(
        {
          error: "Failed to parse JSON from AI response",
          rawResponse: cleanedText,
          responseLength: cleanedText.length,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }
}
