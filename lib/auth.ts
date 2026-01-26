import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { validateCredentials, getUserByStudentId, type User } from "./users";

// Define user session type
declare module "next-auth" {
  interface User {
    id: string;
    studentId: string;
    name: string;
    class: string;
    avatar: string;
  }

  interface Session {
    user: User & {
      id: string;
      studentId: string;
      class: string;
      avatar: string;
    };
  }

}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [
    Credentials({
      name: "Student ID + Password",
      credentials: {
        studentId: { label: "Student ID", type: "text", placeholder: "Enter your Student ID" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.studentId || !credentials?.password) {
          return null;
        }

        const user = await validateCredentials(
          credentials.studentId as string,
          credentials.password as string
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: `${user.studentId}@game-arena.local`,
            image: null,
            studentId: user.studentId,
            class: user.class,
            avatar: user.avatar,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.studentId = (user as unknown as { studentId: string }).studentId;
        token.class = (user as unknown as { class: string }).class;
        token.avatar = (user as unknown as { avatar: string }).avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.studentId = token.studentId as string;
        session.user.class = token.class as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
});

