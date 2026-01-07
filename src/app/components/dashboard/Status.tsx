"use client"

import { useEffect, useState } from "react"
import { getAllStatus } from "@/app/actions/dashboard-actions"
import { 
  MdSettingsInputComponent, 
  MdAnalytics, 
  MdFiberManualRecord, 
  MdMemory,
  MdLocationOn
} from "react-icons/md"

export default function Status({ domain }: { domain: string }) {
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllStatus(domain)
            setData(res)
        }
        fetchData()
        const interval = setInterval(fetchData, 10000)
        return () => clearInterval(interval)
    }, [domain])

    if (!data) return (
        <div className="w-full h-48 bg-slate-900/50 rounded-[2rem] border border-slate-800 animate-pulse flex items-center justify-center">
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Syncing Machine Map...</p>
        </div>
    )

    return (
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
            {/* Inner Header Card */}
            <div className="bg-slate-900/60 p-5 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                        <MdMemory className="text-white text-base" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black italic text-white uppercase tracking-tighter leading-none">Global Machine Status</h2>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time Factory Topology</p>
                    </div>
                </div>

                {/* Legend Mini */}
                <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-1.5 text-green-500"><MdFiberManualRecord size={10} className="animate-pulse" /> Ready</span>
                    <span className="flex items-center gap-1.5 text-amber-500"><MdFiberManualRecord size={10} className="animate-pulse" /> In Progress</span>
                    <span className="flex items-center gap-1.5 text-rose-500"><MdFiberManualRecord size={10} className="animate-ping" /> Urgent</span>
                </div>
            </div>

            {/* Area Konten */}
            <div className="p-6 space-y-8 max-h-[600px] overflow-y-auto custom-scrollbar">
                {data.map((loc: any) => (
                    <div key={loc.id} className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800 italic flex items-center gap-2">
                                <MdLocationOn className="text-blue-500" size={12} />
                                {loc.name}
                            </h3>
                            <div className="h-[1px] flex-1 bg-gradient-to-l from-slate-800 to-transparent"></div>
                        </div>

                        <div className="flex gap-4 w-full">
                            {loc.machines.map((m: any) => {
                                const status = getMachineStatus(m)
                                const style = getStatusStyles(status)
                                return (
                                    <div
                                        key={m.id}
                                        className={`group relative py-2 rounded-lg border flex items-center justify-center transition-all duration-500 w-full ${style}`}
                                    >
                                        <span className="text-[9px] font-black z-10">{m.name}</span>
                                        
                                        {status !== 'NORMAL' && (
                                            <div className={`absolute inset-0 rounded-lg blur-md opacity-40 animate-pulse ${status === 'OPEN' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Card */}
            <div className="bg-slate-900/60 p-3 px-6 border-t border-slate-800 flex justify-between items-center text-[9px] font-bold text-slate-600">
                <div className="flex items-center gap-2">
                    <MdAnalytics className="text-blue-500/50" size={16} />
                    <span className="uppercase tracking-widest">System Health: Optimal</span>
                </div>
                <div className="flex items-center gap-2 uppercase italic">
                    <MdSettingsInputComponent size={14} className="text-slate-700" />
                    Total Nodes: {data.reduce((acc: number, curr: any) => acc + curr.machines.length, 0)}
                </div>
            </div>
        </div>
    )
}

function getMachineStatus(m: any) {
    if (!m.calls || m.calls.length === 0) return "NORMAL"
    const activeCall = m.calls.find((c: any) => c.status === "OPEN" || c.status === "IN_PROGRESS")
    if (!activeCall) return "NORMAL"
    return activeCall.status
}

function getStatusStyles(status: string) {
    switch (status) {
        case "OPEN":
            return "bg-rose-600 border-rose-400 text-white z-10 shadow-lg animate-pulse"
        case "IN_PROGRESS":
            return "bg-amber-500 border-amber-300 text-white z-10"
        default:
            return "bg-green-500/30 border-slate-800 text-slate-50 hover:border-slate-600"
    }
}