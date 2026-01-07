// app/actions/subdomain.ts
'use server'

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers"; 

export async function saveUserSubdomain(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !('id' in session.user)) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id as string;
  const rawDomain = formData.get("domain") as string;
  const emoji = formData.get("emoji") as string;

  const domain = rawDomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (domain.length < 3) {
    return { error: "Subdomain minimal 3 karakter." };
  }

  try {
    const isTaken = await prisma.user.findFirst({
      where: {
        domain: domain,
        NOT: { id: userId }
      }
    });

    if (isTaken) {
      return { error: "Subdomain sudah digunakan orang lain." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        domain: domain,
        image: emoji 
      }
    });

  } catch (error) {
    return { error: "Gagal menyimpan subdomain." };
  }

  // --- LOGIKA REDIRECT KE SUBDOMAIN ---
    
    const headersList = await headers();
    const host = headersList.get("host") ?? ""; // Contoh: "localhost:3000" atau "domainanda.com"
    
    const hostWithoutPort = host.split(":")[0];
    const parts = hostWithoutPort ? hostWithoutPort.split(".") : [];
    // const mainDomain = parts.slice(-2).join("."); // Mengambil 2 bagian terakhir (misal: localhost)
    
    // Tentukan protokol (http untuk lokal, https untuk produksi)
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    
    // Arahkan ke: http://sofyan.localhost:3000
    redirect(`${protocol}://${domain}.${host}`);
}

export async function getSubdomainData(domain: string) {
  return await prisma.user.findFirst({
    where: { domain },
    select: {
      name: true,
      image: true,
      status: true,
      id: true,
    }
  });
}

/**
 * Menghasilkan link absolut ke subdomain tertentu.
 * @param subdomain - Nama subdomain (slug) dari database
 * @param path - Path tambahan setelah domain (opsional, contoh: "/profile")
 */
export async function getSubdomainLink(subdomain: string, path: string = "") {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // Tentukan protokol
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  let baseDomain = "";

  // 1. PRODUCTION - gunakan ENV atau extract dari host
  if (process.env.NODE_ENV === "production") {
    // Prioritas: gunakan NEXT_PUBLIC_ROOT_DOMAIN jika ada
    if (process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
      baseDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    } else {
      // Extract base domain dari host
      baseDomain = extractBaseDomain(host);
    }
  } 
  // 2. DEVELOPMENT - handle localhost dan IP
  else {
    baseDomain = extractBaseDomainDev(host);
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Hasil: protocol://subdomain.baseDomain/path
  return `${protocol}://${subdomain}.${baseDomain}${cleanPath}`;
}

/**
 * Extract base domain untuk PRODUCTION
 * Handles:
 * - andonpro.vercel.app
 * - subdomain.andonpro.vercel.app -> andonpro.vercel.app
 * - andonpro.com
 * - subdomain.andonpro.com -> andonpro.com
 */
function extractBaseDomain(host: string): string {
  const hostname = host.split(':')[0]; // Remove port

  // Handle Vercel deployments
  if (hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('.');
    
    // tenant---branch.vercel.app -> vercel.app (edge case)
    if (hostname.includes('---')) {
      return 'vercel.app';
    }
    
    // subdomain.andonpro.vercel.app -> andonpro.vercel.app (ambil 3 bagian terakhir)
    if (parts.length > 3) {
      return parts.slice(-3).join('.');
    }
    
    // andonpro.vercel.app -> andonpro.vercel.app
    return hostname;
  }

  // Handle custom domains (andonpro.com, subdomain.andonpro.com)
  const parts = hostname.split('.');
  
  // subdomain.andonpro.com -> andonpro.com (ambil 2 bagian terakhir)
  if (parts.length > 2) {
    return parts.slice(-2).join('.');
  }
  
  // andonpro.com -> andonpro.com
  return hostname;
}

/**
 * Extract base domain untuk DEVELOPMENT
 * Handles:
 * - localhost:3000
 * - subdomain.localhost:3000 -> localhost:3000
 * - 192.168.1.15:3000
 * - subdomain.192.168.1.15:3000 -> 192.168.1.15:3000
 * - subdomain.192.168.1.15.nip.io:3000 -> 192.168.1.15.nip.io:3000
 */
function extractBaseDomainDev(host: string): string {
  const parts = host.split(':');
  const hostname = parts[0];
  const port = parts[1] ? `:${parts[1]}` : '';

  // Handle nip.io
  if (hostname.includes('.nip.io')) {
    const nipParts = hostname.split('.');
    // subdomain.192.168.1.15.nip.io -> 192.168.1.15.nip.io (ambil 5 bagian terakhir)
    if (nipParts.length > 6) {
      return nipParts.slice(-6).join('.') + port;
    }
    return hostname + port;
  }

  // Handle IP address
  const ipMatch = hostname.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
  if (ipMatch) {
    return ipMatch[1] + port;
  }

  // Handle localhost
  if (hostname.includes('localhost')) {
    return 'localhost' + port;
  }

  // Fallback
  return host;
}

// Export helper functions untuk testing
export { extractBaseDomain, extractBaseDomainDev };