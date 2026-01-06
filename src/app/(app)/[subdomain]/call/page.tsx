// app/[subdomain]/call/page.tsx
import { getSubdomainData } from '@/lib/subdomain';
import CallContent from '@/app/components/CallContent';
import { Suspense } from 'react';
import { getTeamRole } from '@/app/actions/team-actions';
import { notFound } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Page({ 
  params, 
}: { 
  params: Promise<{ subdomain: string }>, 
}) {
  const { subdomain } = await params;
  console.log("Subdomain:", subdomain);
  
  const [subData, session] = await Promise.all([
    getSubdomainData(subdomain),
    getServerSession(authOptions)
  ]);

  if (!subData) return notFound();

  // Ambil menu role default
  const menu = await getTeamRole(subData.id);

  // Ambil data user dari TeamMember untuk tahu role spesifiknya di organisasi ini
  let userTeamRole = null;
  if (session?.user?.id) {
    const member = await prisma.teamMember.findFirst({
      where: {
        memberId: session.user.id,
        adminId: subData.id
      }
    });
    userTeamRole = member?.role;
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CallContent 
        menu={menu} 
        userTeamRole={userTeamRole!}
        userId={session?.user?.id}
        userName={session?.user?.name!}
      />

    </Suspense>
  );
}