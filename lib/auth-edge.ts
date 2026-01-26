
// Edge-compatible authentication using jose library
// This works in Edge runtime without Node.js crypto

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
);

const JWT_EXPIRY = '24h';

export interface UserPayload extends JWTPayload {
  id: string;
  studentId: string;
  name: string;
  class: string;
  avatar: string;
}

// Create JWT token
export async function createToken(payload: UserPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(SECRET_KEY);
  
  return token;
}

// Verify JWT token
export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as UserPayload;
  } catch {
    return null;
  }
}

// Get current session from cookies
export async function getSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

// Clear auth cookie
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

// Login function
export async function login(
  studentId: string,
  password: string
): Promise<{ success: boolean; user?: UserPayload; error?: string }> {
  // Dynamic import to avoid top-level issues
  const { validateCredentials } = await import('./users');
  
  const user = await validateCredentials(studentId, password);
  
  if (!user) {
    return { success: false, error: 'Invalid Student ID or password' };
  }
  
  const payload: UserPayload = {
    id: user.id,
    studentId: user.studentId,
    name: user.name,
    class: user.class,
    avatar: user.avatar,
  };
  
  const token = await createToken(payload);
  await setAuthCookie(token);
  
  return { success: true, user: payload };
}

// Logout function
export async function logout(): Promise<void> {
  await clearAuthCookie();
}

// Auth middleware helper
export async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const session = await getSession();
  const path = request.nextUrl.pathname;
  
  const isLoginPage = path.startsWith('/login');
  const isRegisterPage = path.startsWith('/register');
  const isApiAuth = path.startsWith('/api/auth');
  const isPublicRoute = path === '/' || isApiAuth;
  
  // Allow API auth routes
  if (isApiAuth) {
    return null;
  }
  
  // Redirect logged in users away from login/register
  if (session && (isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
  
  // Uncomment below to require authentication for all routes
  /*
  if (!session && !isLoginPage && !isRegisterPage && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
  */
  
  return null;
}

