// app/actions/user.ts
'use server'

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function getUserData(userId: string) {
  try {
    // 1. Validasi Autentikasi (Opsional tapi disarankan)
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Tidak terautentikasi");
    }

    // 2. Logika pengambilan data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
        domain: true
      }
    });

    if (!user) {
      return { error: "User tidak ditemukan" };
    }

    return { data: user };
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
    return { error: "Terjadi kesalahan pada server" };
  }
}