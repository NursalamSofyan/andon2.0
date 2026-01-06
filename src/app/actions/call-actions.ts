"use server"

import { prisma } from "@/lib/prisma"; // Pastikan path prisma client Anda benar
import { revalidatePath } from "next/cache";

/**
 * 1. CREATE CALL (Operator menekan tombol bantuan)
 */
export async function createCall(
  machineId: string, 
  roleName: string, 
  location: { lat: number; lng: number } | null
) {
  try {
    const call = await prisma.call.create({
      data: {
        machineId,
        requestedRole: roleName,
        status: "OPEN", // atau CallStatus.OPEN jika pakai enum
        latitude: location?.lat,
        longitude: location?.lng,
      }
    });
    
    return { success: true, data: call };
  } catch (error) {
    console.error("Create call error:", error);
    return { success: false, message: "Gagal membuat panggilan" };
  }
}

/**
 * 2. ACCEPT CALL (Teknisi/Team merespon panggilan)
 */
export async function acceptCall(callId: string, userId: string) {
  try {
    const updatedCall = await prisma.call.update({
      where: { id: callId },
      data: {
        status: "IN_PROGRESS",
        responderId: userId,
        acceptedAt: new Date(),
      }
    });

    revalidatePath("/dashboard");
    return { success: true, data: updatedCall };
  } catch (error) {
    console.error("ACCEPT_CALL_ERROR:", error);
    return { success: false, message: "Gagal merespon panggilan." };
  }
}


export async function closeCall(callId: string, note?: string) {
  try {
    const updatedCall = await prisma.call.update({
      where: { id: callId },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
        note: note || "Masalah diselesaikan",
      }
    });

    revalidatePath("/dashboard");
    return { success: true, data: updatedCall };
  } catch (error) {
    console.error("CLOSE_CALL_ERROR:", error);
    return { success: false, message: "Gagal menyelesaikan panggilan." };
  }
}


export async function getActiveCallsByRole(role: string) {
  try {
    const activeCalls = await prisma.call.findMany({
      where: {
        requestedRole: role,
        // Kita hanya mengambil yang belum CLOSED
        status: {
          in: ["OPEN", "IN_PROGRESS"]
        }
      },
      include: {
        machine: {
          include: {
            location: true // Mengambil info lokasi mesin juga
          }
        },
        responder: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Panggilan terbaru muncul di atas
      }
    });

    return { success: true, data: activeCalls };
  } catch (error) {
    console.error("GET_ACTIVE_CALLS_ERROR:", error);
    return { success: false, message: "Gagal mengambil data panggilan aktif", data: [] };
  }
}

export async function getAllActiveCalls() {
  try {
    const calls = await prisma.call.findMany({
      where: {
        status: { in: ["OPEN", "IN_PROGRESS"] }
      },
      include: {
        machine: { include: { location: true } }
      },
      orderBy: {
        createdAt: 'asc' // Untuk dashboard, mungkin lebih baik yang terlama di atas (FIFO)
      }
    });
    return { success: true, data: calls };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function getActiveCallForMachine(machineId: string) {
  try {
    const calls = await prisma.call.findMany({ // Gunakan findMany untuk mengambil semua
      where: {
        machineId: machineId,
        status: { in: ["OPEN", "IN_PROGRESS"] },
      },
    });
    return { success: true, data: calls };
  } catch (error) {
    console.error("Error fetching active calls:", error);
    return { success: false, data: [] };
  }
}

export async function resolveCall(callId: string) {
  try {
    const updatedCall = await prisma.call.update({
      where: { id: callId },
      data: { 
        status: "CLOSED",
        closedAt: new Date() 
      }
    });

    // Kembalikan objek dengan properti success agar tidak error di frontend
    return { success: true, data: updatedCall };
  } catch (error) {
    console.error("Resolve Error:", error);
    return { success: false, message: "Gagal menyelesaikan panggilan" };
  }
}


export async function getActiveCallsByDivision(divisionName: string) {
  try {
    const calls = await prisma.call.findMany({
      where: {
        status: { in: ["OPEN", "IN_PROGRESS"] },
        requestedRole: divisionName, // Memfilter berdasarkan role
      },
      include: {
        machine: {
          include: { location: true }
        }
      },
      orderBy: { createdAt: "asc" }
    });
    return { success: true, data: calls };
  } catch (error) {
    return { success: false, data: [] };
  }
}