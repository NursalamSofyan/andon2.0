// src/app/(app)

import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSubdomainLink } from "@/lib/subdomain";
import { validateUserStatus } from "@/lib/auth-helpers";
import { getTeamData } from "@/app/actions/team-actions";
import AddTeamForm from "@/app/components/AddTeamForm";
import MemberItem from "@/app/components/MemberItems";
import LocationMachineManager from "@/app/components/LocationMachineMgr";
import { prisma } from "@/lib/prisma";

const SettingsPage = async () => {
const { session, user } = await validateUserStatus();
  
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/dashboard");
  }  

if (!user?.domain) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-rose-300 rounded-xl border-b border-rose-500 p-8 flex flex-col items-center justify-center shadow-xl">
          <p className="text-zinc-800 font-medium text-center">
            You haven't registered any andonPro Sub Domain, <br />
            Create one here !!
          </p>
          <Link 
            href="/createsubdomain" 
            className="bg-red-700 px-6 py-2 rounded-lg mt-8 border-2 border-red-300 text-white hover:bg-red-800 transition-all"
          >
            Create new Sub Domain
          </Link>
        </div>
      </div>
    );
  }

  const fullSubdomainLink = await getSubdomainLink(user.domain);
  const teamMembers = await getTeamData(user.id)

  // Kelompokkan data berdasarkan role operasional
  const mekanik = teamMembers.filter(m => m.role === "MEKANIK");
  const quality = teamMembers.filter(m => m.role === "QUALITY");
  const material = teamMembers.filter(m => m.role === "MATERIAL");

  const locationsWithMachines = await prisma.location.findMany({
  where: { adminId: user.id },
  include: { machines: true },
  orderBy: { name: "asc" }
});
  

  return (
    <MaxWidthWrapper className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold font-mono px-4 py-2 text-zinc-800">Data Settings</h1>
      <Link href="#teams">Teams</Link>
      {/* user Informations */}
      <div className="bg-sky-100 w-full shadow-lg text-zinc-800 rounded-xl border-b-2 border-blue-300">
        <h2 className="font-semibold py-2 bg-sky-600 text-white p-4 rounded-t-lg shadow-sm">
        USER INFORMATIONS
        </h2>
        <div className="grid grid-cols-4 gap-2 p-4">
          <div className="border-b border-zinc-700/50 col-span-2">User Name / email</div>
          <div className="border-b border-zinc-700/50 col-span-2">{user.name} / {user.email}</div>
          <div className="border-b border-zinc-700/50 col-span-2">Link System Andon</div>
          <Link href={fullSubdomainLink} className="border-b border-zinc-700/50 col-span-2">{fullSubdomainLink}</Link>
          <div className="border-b border-zinc-700/50 col-span-2">Account Status</div>
          <div className="border-b border-zinc-700/50 col-span-2">{user.status || "Pending"}</div>
          <div className="border-b border-zinc-700/50 col-span-2">Expired</div>
          <div className="border-b border-zinc-700/50 col-span-2">30 Januari 2026</div>
        </div>
      </div>

    {/* Team Informations */}

    <div className="bg-lime-50 w-full shadow-lg text-zinc-800 rounded-xl border-b-2 border-lime-300 scroll-mt-16" id="teams">
            <h2 className="font-semibold py-2 bg-lime-600 text-white p-4 rounded-t-lg shadow-sm">
              MANAGED TEAMS
            </h2>
            <AddTeamForm adminId={user.id} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
              
              {/* Section Mekanik */}
            <div className="flex flex-col gap-2">
              <h3 className="font-bold border-b-2 border-lime-600 text-lime-700">MEKANIK | <span className="text-slate-500 font-normal">{mekanik.length} members</span></h3>
              {mekanik.map((m) => (
                <MemberItem key={m.id} m={m} link={fullSubdomainLink}/>
              ))}
            </div>

              {/* Section Quality */}
              <div className="flex flex-col gap-2">
                <h3 className="font-bold border-b-2 border-blue-600 text-blue-700">QUALITY | <span className="text-slate-500 font-normal">{quality.length} members</span></h3>
                {quality.map((m) => (
                <MemberItem key={m.id} m={m} link={fullSubdomainLink} />
                ))}
              </div>

              {/* Section Material */}
              <div className="flex flex-col gap-2">
                <h3 className="font-bold border-b-2 border-orange-600 text-orange-700">MATERIAL | <span className="text-slate-500 font-normal">{material.length} members</span></h3>
                {material.map((m) => (
                <MemberItem key={m.id} m={m} link={fullSubdomainLink} />
                ))}
              </div>

            </div>
    </div>

    {/* System Information */}

    <div className="w-full">
      <LocationMachineManager 
            initialLocations={locationsWithMachines} 
            adminId={user.id}
            subdomain={"idm1"} 
          />
    </div>

      <div className="flex items-center justify-center h-100 bg-green-500 mt-20 rounded-xl shadow-lg text-white text-3xl font-semibold">
      Dashboard Page
      </div>
    </MaxWidthWrapper>
  )
}

export default SettingsPage