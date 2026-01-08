import RealtimeMonitor from "@/app/components/dashboard/RealtimeMonitor"
import HourlyHistory from "@/app/components/dashboard/HourlyHistory"
import Status from "@/app/components/dashboard/Status"
import { FaClock, FaSatelliteDish } from "react-icons/fa"
import { MdOutlineAnalytics } from "react-icons/md"

export default async function DashboardPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain } = await params

    return (
        <div className="min-h-screen  p-4 lg:p-6 flex flex-col gap-6 overflow-hidden max-h-screen text-slate-200">
            
            {/* TOP HEADER OPERATIONAL */}
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                        <FaSatelliteDish className="text-white animate-pulse" size={18} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none text-white">
                            Live Monitoring
                        </h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
                            Operational Terminal • {domain}
                        </p>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase">System Status</p>
                        <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs font-bold text-green-500">OPTIMIZED</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </div>
                    </div>
                    <div className="h-8 w-px bg-slate-800" />
                    <div className="flex items-center gap-3 text-slate-400">
                        <FaClock size={20} />
                        <div className="font-mono font-bold text-lg text-white">
                           {/* Jam bisa ditambahkan via client component jika perlu */}
                           REALTIME
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN STATUS CARDS */}
            <div className="shrink-0">
                <Status domain={domain} />
            </div>

            {/* ANALYTICS / HISTORY SECTION */}
            <div className="bg-slate-900/50 h-70 shrink-0 rounded-2xl p-6 shadow-2xl shadow-blue-900/20 border border-slate-800 overflow-hidden relative group">
                <div className="flex items-center gap-2 mb-4">
                    <MdOutlineAnalytics className="text-blue-600" size={20} />
                    <h3 className="font-black text-slate-100 text-sm uppercase tracking-tighter italic">
                        Hourly Response Performance
                    </h3>
                </div>
                <div className="h-full pb-8">
                    <HourlyHistory domain={domain} />
                </div>
            </div>

            {/* WATERMARK FOOTER */}
            <div className="fixed bottom-4 right-6 flex items-center gap-3 text-[10px] font-black text-slate-600 tracking-widest pointer-events-none z-50 bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-800">
                <span className="text-blue-500 uppercase">AndonPro Terminal</span>
                <span className="opacity-30">|</span>
                <span className="uppercase italic">v1.0.4-build</span>
                <span className="opacity-30">|</span>
                <span className="uppercase tracking-normal">ID: {domain}</span>
            </div>

        </div>
    )
}