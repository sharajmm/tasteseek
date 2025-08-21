import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message:
      "recommend-foods API is reachable. Use POST to get recommendations.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const { cuisine, ingredients } = await request.json();
    const prompt = `Suggest 3 to 5 popular foods or dishes from the ${cuisine} cuisine that use the following ingredients: ${ingredients}. Only return a JSON array of food names.`;

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
          max_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get food recommendations");
    }

    const data = await response.json();
    const foodText = data?.choices?.[0]?.message?.content;
    console.log("Raw AI response for foods:", foodText);
    let cleanedText = typeof foodText === "string" ? foodText.trim() : "";
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText
        .replace(/^```[a-zA-Z]*\s*/, "")
        .replace(/```$/, "")
        .trim();
    }
    let foods;
    try {
      const parsed = JSON.parse(cleanedText);
      if (Array.isArray(parsed)) {
        foods = parsed;
      } else if (parsed && typeof parsed === "object") {
        // If object has a 'Foods' key and it's an array, use it
        if (Array.isArray(parsed.Foods)) {
          foods = parsed.Foods;
        } else {
          // If object values are strings, use them; otherwise, use keys
          const values = Object.values(parsed).filter(
            (v) => typeof v === "string" && v.trim()
          );
          if (values.length > 0) {
            foods = values;
          } else {
            foods = Object.keys(parsed);
          }
        }
      } else {
        foods = [];
      }
    } catch (err) {
      console.error("Failed to parse food list:", cleanedText);
      return NextResponse.json(
        { error: "Failed to parse food list", rawResponse: cleanedText },
        { status: 500 }
      );
    }
    return NextResponse.json({ foods });
  } catch (error) {
    console.error("Error getting food recommendations:", error);
    return NextResponse.json(
      { error: "Failed to get food recommendations" },
      { status: 500 }
    );
  }
}
