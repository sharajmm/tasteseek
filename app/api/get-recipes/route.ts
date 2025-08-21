import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
export const dynamic = "force-static";
export const revalidate = 0;

export async function GET() {
  try {
    const q = query(collection(db, "recipes"), orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);

    const recipes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at:
        doc.data().created_at?.toDate?.()?.toISOString() ||
        new Date().toISOString(),
    }));

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error getting recipes:", error);
    return NextResponse.json(
      { error: "Failed to get recipes" },
      { status: 500 }
    );
  }
}
