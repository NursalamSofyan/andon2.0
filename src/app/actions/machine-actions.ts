"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addMachine(name: string, locationId: string) {
  if (!name || !locationId) {
    return { success: false, error: "Nama mesin dan lokasi harus diisi." };
  }

  try {
    const newMachine = await prisma.machine.create({
      data: { 
        name: name.trim(), 
        locationId 
      }
    });
    revalidatePath("/dashboard/settings");
    return { success: true, data: newMachine };
  } catch (error) {
    console.error("Add Machine Error:", error);
    return { success: false, error: "Gagal menambah mesin ke database." };
  }
}

export async function deleteMachine(id: string) {
  try {
    // Opsional: Cek dulu apakah ada data Call yang bergantung pada mesin ini
    await prisma.machine.delete({ 
      where: { id } 
    });
    
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Delete Machine Error:", error);
    return { success: false, error: "Gagal menghapus mesin. Pastikan tidak ada data laporan yang terikat." };
  }
}

export async function checkMachineId(id: string) {
  if (!id) return { success: false, message: "ID tidak disediakan" };

  try {
    const machine = await prisma.machine.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        // Ambil data lokasi secara lengkap
        location: {
          select: {
            id: true,
            name: true,
          }
        },
      }
    });

    if (!machine) {
      return { success: false, message: "Unit mesin tidak terdaftar di sistem andonPro" };
    }

    return { success: true, data: machine };
  } catch (error) {
    console.error("Database Error (checkMachineId):", error);
    return { success: false, message: "Gangguan koneksi database" };
  }
}