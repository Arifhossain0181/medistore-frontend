import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query');

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { success: false, message: 'Query too short' },
      { status: 400 }
    );
  }

  try {
    const backendBaseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'http://localhost:5000';
    const normalizedBaseUrl = backendBaseUrl.replace(/\/$/, '');

    const res = await fetch(
      `${normalizedBaseUrl}/api/search?query=${encodeURIComponent(query)}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        {
          success: false,
          message: errorText || `Backend search failed with status ${res.status}`,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Search proxy failed:', error);
    return NextResponse.json(
      { success: false, message: 'Search failed' },
      { status: 500 }
    );
  }
}
