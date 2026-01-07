import { getActiveCallsByDivision } from "@/app/actions/call-actions"; 
import AnnounceCallList from "@/app/components/AnnounceCalls";
import { MdOutlinePrecisionManufacturing, MdGroups, MdWifiTethering, MdLayers } from "react-icons/md";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface ViewDivisionPageProps {
  params: Promise<{
    subdomain: string;
    division: string;
  }>;
}

export default async function ViewDivisionPage({ params }: ViewDivisionPageProps) {
  const { division: divName } = await params;
  
  // Ambil data panggilan aktif berdasarkan divisi
  const result = await getActiveCallsByDivision(divName.toUpperCase());
  const activeCalls = result.data || [];

  // Logic warna identitas divisi
  const getDivisionTheme = (name: string) => {
    const n = name.toUpperCase();
    if (n.includes("MEKANIK")) return "from-amber-500 to-orange-600 shadow-amber-500/20";
    if (n.includes("QUALITY")) return "from-blue-600 to-indigo-700 shadow-blue-500/20";
    if (n.includes("MATERIAL")) return "from-emerald-500 to-teal-600 shadow-emerald-500/20";
    return "from-slate-700 to-slate-900 shadow-slate-500/20";
  };

  return (
    <div className="min-h-screen bg-[#fafafa] lg:p-8">
      {/* HEADER SECTION */}
      <header className="mb-10 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative Background Icon */}
        <MdOutlinePrecisionManufacturing className="absolute -right-10 -bottom-10 text-slate-50 text-[15rem] -rotate-12 pointer-events-none" />

        <div className="flex items-center gap-6 relative z-10">
          <div className={`p-5 bg-gradient-to-br ${getDivisionTheme(divName)} text-white rounded-2xl shadow-2xl transition-transform hover:scale-105 duration-500`}>
            <MdGroups size={48} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <MdLayers className="text-blue-600" size={16} />
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Operational Unit</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Monitoring <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">{divName}</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-3 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-slate-300"></span>
              Live Alert System • Team {divName.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 relative z-10">
            <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">System Status</span>
                <span className="font-mono font-bold text-green-600 text-xs">STABLE / SYNCED</span>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-inner border border-slate-100">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
               <MdWifiTethering size={14} className="animate-pulse" />
               <span className="text-[8px] font-black uppercase tracking-widest">AndonPro Satellite v2.0</span>
            </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative">
        <AnnounceCallList activeCalls={activeCalls} />
      </main>

      {/* FOOTER INFO */}
      <footer className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center opacity-50">
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
           &copy; 2024 AndonPro Industrial Solutions
         </p>
         <div className="flex gap-4">
            <div className="h-1 w-8 bg-amber-400 rounded-full"></div>
            <div className="h-1 w-8 bg-blue-500 rounded-full"></div>
            <div className="h-1 w-8 bg-emerald-500 rounded-full"></div>
         </div>
      </footer>
    </div>
  );
}