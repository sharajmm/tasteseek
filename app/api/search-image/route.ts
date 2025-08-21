import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    const response = await fetch(`https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query + ' food recipe')}&api_key=${process.env.SERPAPI_KEY}&num=1`);
    
    if (!response.ok) {
      throw new Error('Failed to search images');
    }

    const data = await response.json();
    
    if (data.images_results && data.images_results.length > 0) {
      return NextResponse.json({
        image_url: data.images_results[0].original
      });
    }

    return NextResponse.json({
      image_url: null
    });
  } catch (error) {
    console.error('Error searching image:', error);
    return NextResponse.json({
      image_url: null
    });
  }
}