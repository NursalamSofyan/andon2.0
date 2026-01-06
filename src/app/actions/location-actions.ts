// src/app/actions/location-actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Fungsi Ambil Data
export async function getLocationData(adminId: string) {
  return await prisma.location.findMany({
    where: { adminId },
    orderBy: { name: "asc" },
    include: {
      machines: true, // Sertakan mesin agar bisa dihitung atau ditampilkan
    },
  });
}

// 2. Fungsi Tambah
export async function addLocation(formData: { name: string; adminId: string }) {
  try {
    await prisma.location.create({
      data: {
        name: formData.name,
        adminId: formData.adminId,
      },
    });
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menambah lokasi" };
  }
}

// 3. Fungsi Hapus (PASTIKAN ADA KATA EXPORT)
export async function deleteLocation(locationId: string) {
  try {
    await prisma.location.delete({
      where: { id: locationId },
    });
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal menghapus lokasi" };
  }
}