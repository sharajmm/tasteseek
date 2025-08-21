import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    const response = await fetch(`https://serpapi.com/search.json?engine=youtube&search_query=${encodeURIComponent(query + ' recipe tutorial')}&api_key=${process.env.SERPAPI_KEY}`);
    
    if (!response.ok) {
      throw new Error('Failed to search videos');
    }

    const data = await response.json();
    
    if (data.video_results && data.video_results.length > 0) {
      const videoId = data.video_results[0].link.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (videoId && videoId[1]) {
        return NextResponse.json({
          video_url: `https://www.youtube.com/embed/${videoId[1]}`
        });
      }
    }

    return NextResponse.json({
      video_url: null
    });
  } catch (error) {
    console.error('Error searching video:', error);
    return NextResponse.json({
      video_url: null
    });
  }
}