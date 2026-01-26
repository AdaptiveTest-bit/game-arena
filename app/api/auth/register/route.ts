
import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByStudentId } from "@/lib/users";

// POST /api/auth/register - Register a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, name, class: className, phoneNumber, password, avatar } = body;

    // Validate required fields
    if (!studentId || !name || !className || !phoneNumber || !password) {
      return NextResponse.json(
        { 
          error: "All fields are required",
          details: "Please fill in all fields: Student ID, Name, Class, Phone Number, and Password"
        },
        { status: 400 }
      );
    }

    // Validate student ID format
    if (studentId.length < 3) {
      return NextResponse.json(
        { 
          error: "Student ID too short",
          details: "Student ID must be at least 3 characters long"
        },
        { status: 400 }
      );
    }

    // Validate student ID format (alphanumeric only)
    if (!/^[a-zA-Z0-9_]+$/.test(studentId)) {
      return NextResponse.json(
        { 
          error: "Invalid Student ID format",
          details: "Student ID can only contain letters, numbers, and underscores"
        },
        { status: 400 }
      );
    }

    // Validate phone number format (10 digits)
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return NextResponse.json(
        { 
          error: "Invalid phone number",
          details: "Phone number must be exactly 10 digits"
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 4) {
      return NextResponse.json(
        { 
          error: "Password too short",
          details: "Password must be at least 4 characters long"
        },
        { status: 400 }
      );
    }

    // Check if student ID already exists
    const existingUser = await getUserByStudentId(studentId);
    if (existingUser) {
      return NextResponse.json(
        { 
          error: "Student ID already exists",
          details: `The Student ID "${studentId}" is already registered. Try a different one.`
        },
        { status: 409 }
      );
    }

    // Create new user (with avatar if provided)
    const user = await createUser(studentId, name, className, phoneNumber, password, avatar);

    if (!user) {
      return NextResponse.json(
        { 
          error: "Registration failed",
          details: "Could not create user. Please try again or contact support."
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Registration successful!",
        user: {
          id: user.id,
          studentId: user.studentId,
          name: user.name,
          class: user.class,
          phoneNumber: user.phoneNumber,
          avatar: user.avatar,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        return NextResponse.json(
          { 
            error: "Database connection failed",
            details: "Cannot connect to the database. Please check your .env file and ensure PostgreSQL is running."
          },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: "Server error",
        details: "An unexpected error occurred. Please try again later."
      },
      { status: 500 }
    );
  }
}

