// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect ke login page saat error
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please provide email and password");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          // User tidak ditemukan
          if (!user) {
            throw new Error("No account found with this email");
          }

          // User tidak memiliki password (mungkin OAuth user)
          if (!user.password) {
            throw new Error("Invalid login method. Please use the correct sign-in option");
          }

          // Cek status user
          if (user.status === "suspended") {
            throw new Error("Account is suspended. Please contact administrator");
          }

          if (user.status === "pending") {
            throw new Error("Account is pending approval. Please wait for administrator approval");
          }

          if (user.status !== "active") {
            throw new Error("Account is not active. Please contact administrator");
          }

          // Verifikasi password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password, 
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid email or password");
          }

          // Login berhasil
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            domain: user.domain,
            status: user.status,
            image: user.image
          };
        } catch (error: any) {
          console.error("Authorization error:", error.message);
          throw new Error(error.message);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.domain = (user as any).domain;
        token.status = (user as any).status;
      }

      // Handle session update
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).domain = token.domain;
        (session.user as any).status = token.status;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User ${user.email} signed in successfully`);
    },
    async signOut({ token }) {
      console.log(`User signed out`);
    }
  }
};