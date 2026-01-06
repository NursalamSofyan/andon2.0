import { getActiveCallsByDivision } from "@/app/actions/call-actions"; 
import AnnounceCallList from "@/app/components/AnnounceCalls";
import { MdOutlinePrecisionManufacturing, MdGroups } from "react-icons/md";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Daftar divisi yang valid (Opsional: untuk validasi)
const VALID_DIVISIONS = ["MEKANIK", "QUALITY", "MATERIAL"];

interface ViewDivisionPageProps {
  division: any;
  params: {
    division: {
      subdomain: string,
      division: string
    };
  };
}

export default async function ViewDivisionPage({ params }: {params : Promise<ViewDivisionPageProps>}) {
  const division  = await params;
  const div = division.division
  
  console.log({log: div})
  // 1. Validasi (Opsional)
  // if (!VALID_DIVISIONS.includes(String(division).toLowerCase())) {
  //   return notFound();
  // }


  const result = await getActiveCallsByDivision(div.toUpperCase());
  const activeCalls = result.data || [];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
            <MdGroups size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
              Monitoring {div}
            </h1>
            <p className="text-slate-500 font-medium">
              Antrean panggilan aktif khusus Tim {div.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Status</span>
           <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="font-mono font-bold text-slate-700">CONNECTED</span>
           </div>
        </div>
      </header>

      <main>
        <AnnounceCallList activeCalls={activeCalls} />
      </main>
    </div>
  );
}