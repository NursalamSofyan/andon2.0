'use server'

import { prisma } from "@/lib/prisma"; // Pastikan path prisma client Anda benar
import { startOfDay, endOfDay, format } from "date-fns"

export async function getDashboardStats(domain: string) {
    try {
        const admin = await prisma.user.findFirst({
            where: { domain },
            select: { id: true, name: true }
        })

        if (!admin) {
            return { success: false, error: "Domain not found" }
        }

        const todayStart = startOfDay(new Date())
        const todayEnd = endOfDay(new Date())

        const activeCalls = await prisma.call.findMany({
            where: {
                machine: { location: { adminId: admin.id } },
                status: { in: ['OPEN', 'IN_PROGRESS'] }
            },
            include: {
                machine: {
                    include: { location: true }
                },
                responder: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // 2. Fetch Daily Stats
        const totalCallsToday = await prisma.call.count({
            where: {
                machine: { location: { adminId: admin.id } },
                createdAt: { gte: todayStart, lte: todayEnd }
            }
        })

        const resolvedToday = await prisma.call.count({
            where: {
                machine: { location: { adminId: admin.id } },
                createdAt: { gte: todayStart, lte: todayEnd },
                status: 'CLOSED'
            }
        })

        return {
            success: true,
            data: {
                adminName: admin.name,
                activeCalls,
                stats: {
                    total: totalCallsToday,
                    resolved: resolvedToday,
                    open: activeCalls.length
                }
            }
        }

    } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return { success: false, error: "Failed to fetch dashboard stats" }
    }
}

export async function getHourlyHistory(domain: string) {
    try {
        const admin = await prisma.user.findFirst({
            where: { domain },
            select: { id: true }
        })

        if (!admin) return { success: false, error: "Domain not found" }

        const todayStart = startOfDay(new Date())
        const todayEnd = endOfDay(new Date())

        // Fetch all calls today with role info
        const calls = await prisma.call.findMany({
            where: {
                machine: { location: { adminId: admin.id } },
                createdAt: { gte: todayStart, lte: todayEnd }
            },
            select: {
                createdAt: true,
                requestedRole: true
            }
        })

        // Aggregate by Hour and Role
        // Structure: { "08:00": { "MECHANIC": 2, "QUALITY": 1 }, ... }
        const history: Record<string, Record<string, number>> = {}

        // Initialize hours 00:00 to 23:00
        for (let i = 0; i < 24; i++) {
            const hourKey = `${i.toString().padStart(2, '0')}:00`
            history[hourKey] = {}
        }

        calls.forEach(call => {
            const hourKey = format(call.createdAt, "HH:00");
            const role = call.requestedRole || "UNKNOWN";

            if (!history[hourKey]) history[hourKey] = {};
            if (!history[hourKey][role]) history[hourKey][role] = 0;

            history[hourKey][role]++;
        })

        return { success: true, history }

    } catch (error) {
        console.error("Error fetching hourly history:", error)
        return { success: false, error: "Failed to fetch history" }
    }
}


export type MachineStatus = {
    id: string
    name: string
    status: "NORMAL" | "OPEN" | "IN_PROGRESS"
}

export type LocationStatus = {
    id: string
    name: string
    machines: MachineStatus[]
}

export async function getAllStatus(domain: string) {

    const admin = await prisma.user.findFirst({
        where: { domain },
        select: { id: true, name: true }
    })

    if (!admin) {
        return { success: false, error: "Domain not found" }
    }

  return await prisma.location.findMany({
    where: { adminId : admin.id },
    orderBy: { name: "asc" },
    include: {
      machines: {
        orderBy: {name : "asc"},
        include: {
            calls: true
        }
      }, 
    },
  });
}

