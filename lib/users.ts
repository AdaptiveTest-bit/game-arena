import { hash, compare } from 'bcryptjs';
import prisma from './db';

export interface User {
  id: string;
  studentId: string;
  name: string;
  class: string;
  phoneNumber: string;
  passwordHash: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

// Public user info (without password)
export interface PublicUser {
  id: string;
  studentId: string;
  name: string;
  class: string;
  phoneNumber: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create new user
export async function createUser(
  studentId: string,
  name: string,
  className: string,
  phoneNumber: string,
  password: string,
  avatar: string = "😊"
): Promise<User | null> {
  try {
    // Check if student ID already exists
    const existingUser = await prisma.user.findUnique({
      where: { studentId },
    });

    if (existingUser) {
      return null;
    }

    // Hash password
    const passwordHash = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        studentId,
        name,
        class: className,
        phoneNumber,
        passwordHash: passwordHash,
        avatar: avatar,
      },
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Validate credentials
export async function validateCredentials(
  studentId: string,
  password: string
): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { studentId },
    });

    if (!user) {
      return null;
    }

    const isValid = await compare(password, user.passwordHash);

    if (!isValid) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error validating credentials:', error);
    return null;
  }
}

// Get user by student ID
export async function getUserByStudentId(studentId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { studentId },
    });
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

// Get all users (for admin purposes)
export async function getAllUsers(): Promise<PublicUser[]> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        studentId: true,
        name: true,
        class: true,
        phoneNumber: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

// Update user
export async function updateUser(
  id: string,
  updates: Partial<Omit<User, 'id' | 'createdAt' | 'studentId' | 'password'>>
): Promise<User | null> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: updates,
    });
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

// Delete user
export async function deleteUser(id: string): Promise<boolean> {
  try {
    await prisma.user.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

