// src/app/(app)/dashboard/settings/print-qr/page.tsx

import { prisma } from "@/lib/prisma";
import { validateUserStatus } from "@/lib/auth-helpers";
import { getSubdomainLink } from "@/lib/subdomain";
import PrintQRClient from "@/app/components/PrintQRClient";

// Tambahkan type untuk props searchParams
interface PageProps {
  searchParams: Promise<{ locationId?: string }>;
}

export default async function PrintAllQRPage({ searchParams }: PageProps) {
  const { user } = await validateUserStatus();
  const loginUrl = await getSubdomainLink(user.domain!);
  
  // Tunggu searchParams jika menggunakan Next.js 15
  const { locationId } = await searchParams;

  const locations = await prisma.location.findMany({
    where: { 
      adminId: user.id,
      // Jika ada locationId, filter hanya ID tersebut. Jika tidak, ambil semua.
      ...(locationId ? { id: locationId } : {})
    },
    include: { 
      machines: true 
    },
    orderBy: { 
      name: "asc" 
    },
  });

  return (
    <PrintQRClient 
      locations={locations} 
      loginUrl={loginUrl} 
      isFiltered={!!locationId} 
    />
  );
}