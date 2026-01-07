import { getSubdomainData } from "@/lib/subdomain";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaLock } from "react-icons/fa";
import { MdOutlinePrecisionManufacturing, MdOutlineFactory } from "react-icons/md";

interface SubdomainPageProps {
  params: { subdomain: string };
}

export default async function SubdomainHomePage({ params }: SubdomainPageProps) {
  const { subdomain } = await params;
  
  // Ambil data user/subdomain dari database
  const data = await getSubdomainData(subdomain);
  if (!data) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  
  // Jika belum login, arahkan ke login subdomain spesifik ini
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-5">
         <MdOutlineFactory className="absolute -top-20 -left-20 text-[40rem] rotate-12" />
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-200 overflow-hidden">
          
          {/* Header Area */}
          <div className="bg-slate-900 p-12 text-center relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <MdOutlinePrecisionManufacturing size={120} className="text-white" />
            </div>
            
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20 mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <span className="text-5xl">{data.image || "🏭"}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
              {data.name}
            </h1>
            <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.3em]">
              AndonPro Operational System
            </p>
          </div>

          {/* Content Area */}
          <div className="p-10 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-8 bg-green-50 px-4 py-2 rounded-full border border-green-100">
               <FaCheckCircle className="text-green-500" size={14} />
               <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">
                 Sistem Status: {data.status || "Active"}
               </span>
            </div>

            <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed">
              Selamat datang di sistem monitoring AndonPro. Silakan lanjutkan ke dashboard operasional untuk mengelola panggilan dan tim produksi.
            </p>

            <div className="grid grid-cols-1 gap-4 w-full">
              <Link 
                href="/dashboard"
                className="group bg-slate-900 text-white p-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
              >
                Buka Dashboard Produksi
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <div className="flex items-center justify-center gap-2 text-slate-400 py-4">
                <FaLock size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Operational Channel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Powered by <span className="text-slate-900">AndonPro</span> Industrial Solution
            </p>
        </div>
      </div>
    </div>
  );
}