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
  const host = headersList.get("host") || ""; // Contoh: "192.168.1.15:3000" atau "sofyan.192.168.1.15:3000"

  // Tentukan protokol
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  let baseDomain = "";

  if (process.env.NODE_ENV === "production") {
    // Di produksi, kita ambil root domain dari ENV
    baseDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "andonpro.com";
  } else {
    /**
     * LOGIKA UNTUK IP / LOCALHOST
     * Kita harus membuang subdomain yang sedang aktif dari host
     * misal: dari "sofyan.192.168.1.15:3000" menjadi "192.168.1.15:3000"
     */
    const parts = host.split(".");
    
    // Jika ada lebih dari 1 titik (misal: sofyan.192.168.1.15:3000), 
    // maka parts.length akan > 3 (karena IP sendiri punya 3 titik)
    // Cara paling aman adalah mengambil 4 bagian terakhir jika itu IP, atau 1 bagian terakhir jika itu 'localhost'
    
    const isIP = host.match(/\d+\.\d+\.\d+\.\d+/); // Cek apakah host mengandung pola IP

    if (isIP) {
      // Jika IP, kita ambil IP + Port-nya saja, buang prefix subdomain jika ada
      baseDomain = isIP[0] + (host.split(":")[1] ? `:${host.split(":")[1]}` : "");
    } else {
      // Jika localhost:3000 atau sofyan.localhost:3000
      baseDomain = parts.length > 1 ? parts.slice(-1)[0] : host;
    }
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Hasil: http://subdomain.192.168.1.15:3000/path
  return `${protocol}://${subdomain}.${baseDomain}${cleanPath}`;
}