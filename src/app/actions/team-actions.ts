// src/app/actions/team-actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function addTeamMember(formData: {
  adminId: string;
  name: string;
  email: string;
  password: string;
  andonRole: string; // Misal: "MEKANIK", "QUALITY"
}) {
  try {
    // 1. Validasi: Apakah email sudah dipakai?
    const existingUser = await prisma.user.findUnique({
      where: { email: formData.email },
    });

    if (existingUser) {
      return { success: false, error: "Email sudah terdaftar." };
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // 3. Transaction: Buat User dan Hubungkan ke Tim
    await prisma.$transaction(async (tx) => {
      // Buat identitas login di tabel User
      const newUser = await tx.user.create({
        data: {
          name: formData.name,
          email: formData.email,
          password: hashedPassword,
          role: "TEAM",
          status: "active",
        },
      });

      // Daftarkan user tersebut ke tim admin ini
      await tx.teamMember.create({
        data: {
          adminId: formData.adminId,
          memberId: newUser.id,
          role: formData.andonRole, 
          lastPassword: formData.password
        },
      });
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Anggota tim berhasil ditambahkan." };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: "Gagal menambahkan anggota tim." };
  }
}

export async function getTeamData(adminId: string) {
  try {
    if (!adminId) return [];

    const team = await prisma.teamMember.findMany({
      where: {
        adminId: adminId,
      },
      include: {
        // Melakukan join ke tabel User untuk mengambil detail anggota (member)
        member: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
      orderBy: {
        // Mengurutkan berdasarkan role (MEKANIK, QUALITY, dll)
        role: 'asc',
      },
    });

    return team;
  } catch (error) {
    console.error("Error fetching team data:", error);
    return [];
  }
}

export async function deleteTeamMember(memberId: string, adminId: string) {
  try {
    // 1. Proteksi: Pastikan yang menghapus adalah Admin yang sedang login
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== adminId) {
      return { success: false, error: "Otorisasi ditolak." };
    }
    await prisma.user.delete({
        where: {
        id: memberId,
        team_as_member: {
          some: {
            adminId: adminId
          }
        }
      },
    })

    // 3. Refresh data di halaman dashboard/settings
    revalidatePath("/dashboard/settings");
    
    return { success: true, message: "Anggota tim berhasil dihapus." };
  } catch (error: any) {
    console.error("Delete error:", error);
    return { success: false, error: "Gagal menghapus anggota tim." };
  }
}

export async function getTeamRole(adminId: string): Promise<string[]> {
  try {
    const data = await prisma.teamMember.findMany({
      where: { adminId: adminId },
      select: { role: true },
      distinct: ['role']
    });

    // Filter(Boolean) secara otomatis membuang null/undefined
    // Kita tambahkan 'as string[]' untuk meyakinkan TypeScript
    const result = data.map((item) => item.role).filter(Boolean) as string[];
    
    return result; 
  } catch (error) {
    console.error(error);
    return [];
  }
}