
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-edge';

// GET /api/auth/session
export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({
      user: null,
      authenticated: false,
    });
  }
  
  return NextResponse.json({
    user: session,
    authenticated: true,
  });
}

