import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Simple middleware that doesn't rely on complex auth
  const { pathname } = request.nextUrl

  // Allow access to auth pages
  if (pathname.startsWith("/auth/")) {
    return NextResponse.next()
  }

  // Allow access to API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // For all other routes, just continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
