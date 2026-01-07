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
import { FaUserShield, FaUsers, FaCogs, FaExternalLinkAlt, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import { MdOutlineFactory } from "react-icons/md";

const SettingsPage = async () => {
  const { session, user } = await validateUserStatus();

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  if (!user?.domain) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center px-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-10 flex flex-col items-center justify-center shadow-xl shadow-slate-200/50 max-w-lg text-center">
          <div className="bg-amber-100 p-4 rounded-full mb-6">
            <FaExclamationTriangle className="text-amber-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Subdomain Diperlukan</h2>
          <p className="text-slate-500 font-medium mb-8">
            Anda harus memiliki subdomain aktif sebelum dapat mengakses pengaturan sistem.
          </p>
          <Link
            href="/createsubdomain"
            className="bg-blue-600 px-8 py-4 rounded-xl text-white font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Daftarkan Subdomain
          </Link>
        </div>
      </div>
    );
  }

  const fullSubdomainLink = await getSubdomainLink(user.domain);
  const teamMembers = await getTeamData(user.id);

  const mekanik = teamMembers.filter((m) => m.role === "MEKANIK");
  const quality = teamMembers.filter((m) => m.role === "QUALITY");
  const material = teamMembers.filter((m) => m.role === "MATERIAL");

  const locationsWithMachines = await prisma.location.findMany({
    where: { adminId: user.id },
    include: { machines: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen pt-6 pb-16">
      <MaxWidthWrapper className="flex flex-col gap-8">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 sm:px-0">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
              System Settings
            </h1>
            <p className="text-slate-500 font-medium">Konfigurasi operasional dan tim produksi Anda.</p>
          </div>
          
          {/* QUICK NAV */}
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <Link href="#info" className="px-4 py-2 text-xs font-black uppercase text-slate-500 hover:text-blue-600 transition">Info</Link>
            <Link href="#teams" className="px-4 py-2 text-xs font-black uppercase text-slate-500 hover:text-blue-600 transition">Teams</Link>
            <Link href="#machines" className="px-4 py-2 text-xs font-black uppercase text-slate-500 hover:text-blue-600 transition">Machines</Link>
          </div>
        </div>

        {/* 1. USER & SYSTEM INFORMATION */}
        <div id="info" className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden scroll-mt-28">
          <div className="bg-slate-900 px-8 py-4 flex items-center gap-3">
            <FaUserShield className="text-blue-400 text-xl" />
            <h2 className="font-black text-sm text-white uppercase tracking-widest">
              Administrator & License
            </h2>
          </div>
          
          <div className="p-8 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Admin Account</label>
              <p className="font-bold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Account Status</label>
              <div className="flex items-center gap-2 text-sm font-black text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {user.status || "ACTIVE"}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">License Expired</label>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <FaCalendarAlt className="text-blue-500" />
                30 Januari 2026
              </div>
            </div>

            <div className="lg:col-span-1 p-4 bg-blue-50 rounded-2xl border border-blue-100 group">
              <label className="text-[10px] font-black text-blue-600 uppercase block mb-1">Production Link</label>
              <Link 
                href={fullSubdomainLink} 
                className="text-xs font-black text-blue-700 flex items-center gap-2 hover:underline break-all"
              >
                <MdOutlineFactory size={16} />
                {user.domain}.andonpro.id
                <FaExternalLinkAlt size={10} />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. TEAM MANAGEMENT */}
        <div id="teams" className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden scroll-mt-28">
          <div className="bg-slate-900 px-8 py-4 flex items-center gap-3">
            <FaUsers className="text-blue-400 text-xl" />
            <h2 className="font-black text-sm text-white uppercase tracking-widest">
              Managed Teams
            </h2>
          </div>
          
          <div className="p-8">
            <div className="mb-8">
              <AddTeamForm adminId={user.id} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* MEKANIK SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-4 border-amber-500 pb-2">
                  <h3 className="font-black text-slate-800 italic">MEKANIK</h3>
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded-md">{mekanik.length} Personel</span>
                </div>
                <div className="flex flex-col gap-3">
                  {mekanik.map((m) => (
                    <MemberItem key={m.id} m={m} link={fullSubdomainLink}/>
                  ))}
                </div>
              </div>

              {/* QUALITY SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-4 border-blue-600 pb-2">
                  <h3 className="font-black text-slate-800 italic">QUALITY</h3>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-md">{quality.length} Personel</span>
                </div>
                <div className="flex flex-col gap-3">
                  {quality.map((m) => (
                    <MemberItem key={m.id} m={m} link={fullSubdomainLink} />
                  ))}
                </div>
              </div>

              {/* MATERIAL SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-4 border-green-600 pb-2">
                  <h3 className="font-black text-slate-800 italic">MATERIAL</h3>
                  <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-md">{material.length} Personel</span>
                </div>
                <div className="flex flex-col gap-1">
                  {material.map((m) => (
                    <MemberItem key={m.id} m={m} link={fullSubdomainLink} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MACHINE & LOCATION MANAGER */}
        <div id="machines" className="scroll-mt-28">
           <div className="bg-slate-900 rounded-t-2xl px-8 py-4 flex items-center gap-3 border-x border-t border-slate-200">
            <FaCogs className="text-blue-400 text-xl" />
            <h2 className="font-black text-sm text-white uppercase tracking-widest">
              Locations & Machine Layout
            </h2>
          </div>
          <div className="bg-white p-8 rounded-b-2xl shadow-xl shadow-slate-200/50 border border-slate-200">
            <LocationMachineManager 
              initialLocations={locationsWithMachines} 
              adminId={user.id}
              subdomain={user.domain} 
            />
          </div>
        </div>

        {/* FOOTER DECORATION */}
        <div className="flex items-center justify-center p-12 bg-slate-900 mt-8 rounded-2xl shadow-2xl relative overflow-hidden group">
          <MdOutlineFactory className="absolute -right-10 -bottom-10 text-white/5 text-[15rem] rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          <div className="text-center relative z-10">
            <h3 className="text-white text-2xl font-black italic tracking-tighter">andonPro Configuration</h3>
            <p className="text-slate-400 text-sm font-medium">Lantai produksi Anda berada dalam kontrol penuh.</p>
          </div>
        </div>

      </MaxWidthWrapper>
    </div>
  );
};

export default SettingsPage;