
import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth-edge';

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, password } = body;

    // Validate required fields
    if (!studentId || !password) {
      return NextResponse.json(
        { error: 'Student ID and password are required' },
        { status: 400 }
      );
    }

    const result = await login(studentId, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Login successful',
      user: result.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

