import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle uploads directory requests
  if (pathname.startsWith('/uploads/')) {
    // Add proper headers for static file serving
    const response = NextResponse.next();
    
    // Set cache headers for uploaded images
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
    
    // Add CORS headers if needed
    response.headers.set('Access-Control-Allow-Origin', '*');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/uploads/:path*',
  ],
};
