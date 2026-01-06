// src/lib/auth-helpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function validateUserStatus() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  // Cek flag shouldSignOut dari session
  if ((session.user as any).shouldSignOut) {
    redirect("/api/auth/signout?callbackUrl=/account-suspended");
  }

  // Fetch fresh user data from database untuk double-check
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { 
      id: true, 
      status: true, 
      email: true, 
      name: true, 
      domain: true, 
      role: true 
    }
  });

  if (!user) {
    redirect("/api/auth/signout?callbackUrl=/login");
  }

  // Check if user is suspended or inactive
  if (user.status !== "active") {
    redirect("/api/auth/signout?callbackUrl=/account-suspended");
  }

  return { session, user };
}