
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/auth-edge';

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow static files and API routes
  if (
    path.startsWith('/_next') ||
    path.startsWith('/static') ||
    path.startsWith('/favicon') ||
    path.startsWith('/api/auth') ||
    path.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get session
  const session = await getSession();
  const isLoggedIn = !!session;
  
  const isLoginPage = path.startsWith('/login');
  const isRegisterPage = path.startsWith('/register');
  const isHomePage = path === '/';

  // Redirect logged in users away from login/register
  if (isLoggedIn && (isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // Uncomment below to require authentication for all routes
  /*
  if (!isLoggedIn && !isLoginPage && !isRegisterPage && !isHomePage) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (authentication endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};

