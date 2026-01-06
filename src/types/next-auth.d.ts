// src/types/next-auth.d.ts
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string | null;
      domain?: string | null;
      status?: string | null;
      shouldSignOut?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string | null;
    domain?: string | null;
    status?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string | null;
    domain?: string | null;
    status?: string | null;
    shouldSignOut?: boolean;
  }
}