"use client"

import { useEffect, useState } from "react"
import { getHourlyHistory } from "@/app/actions/dashboard-actions"
import { format } from "date-fns"
import { MdHistory, MdBarChart } from "react-icons/md"

export default function HourlyHistory({ domain }: { domain: string }) {
    const [history, setHistory] = useState<Record<string, Record<string, number>>>({})
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        const res = await getHourlyHistory(domain)
        if (res.success && res.history) {
            setHistory(res.history)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 60000)
        return () => clearInterval(interval)
    }, [domain])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                <MdBarChart className="animate-bounce" size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest">Processing Data...</span>
            </div>
        )
    }

    let maxCount = 0
    Object.values(history).forEach(hourData => {
        const total = Object.values(hourData).reduce((a, b) => a + b, 0)
        if (total > maxCount) maxCount = total
    })
    if (maxCount === 0) maxCount = 1

    const hours = Object.keys(history).sort()

    // Fungsi mapping warna agar konsisten dengan Dashboard lainnya
    const getRoleColor = (role: string) => {
        const r = role.toUpperCase()
        if (r.includes('MEKANIK') || r.includes('MECHANIC')) return "bg-amber-500"
        if (r.includes('QUALITY')) return "bg-blue-600"
        if (r.includes('MATERIAL')) return "bg-green-500"
        return "bg-slate-500"
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 flex items-end gap-1.5 overflow-x-auto pb-4 custom-scrollbar min-h-45">
                {hours.map((hour) => {
                    const data = history[hour] || {}
                    const roles = Object.keys(data)
                    const total = Object.values(data).reduce((a, b) => a + b, 0)

                    return (
                        <div key={hour} className="flex flex-col items-center gap-3 group min-w-8 flex-1">
                            {/* Bar Container */}
                            <div className="w-full bg-slate-100/50 rounded-t-lg relative flex flex-col-reverse overflow-hidden hover:bg-blue-50 transition-all h-37.5 border border-slate-100 shadow-inner">
                                
                                {/* Tooltip */}
                                {total > 0 && (
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-slate-900 text-white text-[9px] p-2 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all z-50 whitespace-nowrap pointer-events-none border border-slate-700">
                                        <p className="font-black border-b border-slate-700 pb-1 mb-1 text-blue-400 uppercase tracking-tighter">Pukul {hour}</p>
                                        {roles.map(r => (
                                            <div key={r} className="flex justify-between gap-4 py-0.5">
                                                <span className="font-bold opacity-80 uppercase">{r}</span>
                                                <span className="font-black text-blue-300">{data[r]}</span>
                                            </div>
                                        ))}
                                        <div className="mt-1 pt-1 border-t border-slate-700 flex justify-between font-black">
                                            <span>TOTAL</span>
                                            <span className="text-white">{total}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Stacked Bars */}
                                {roles.map((role) => {
                                    const count = data[role]
                                    const heightPerc = (count / maxCount) * 100
                                    return (
                                        <div
                                            key={role}
                                            style={{ height: `${heightPerc}%` }}
                                            className={`${getRoleColor(role)} w-full opacity-90 hover:opacity-100 border-t border-white/20 transition-all duration-500 shadow-lg`}
                                        />
                                    )
                                })}
                            </div>
                            
                            {/* X-Axis Label */}
                            <span className="text-[9px] font-black text-slate-500 font-mono tracking-tighter uppercase">
                                {hour}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Legend & Footer */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-[9px] font-black text-slate-400 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
                    <span className="uppercase tracking-widest">Quality</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    <div className="w-2 h-2 bg-amber-500 rounded-sm"></div>
                    <span className="uppercase tracking-widest">Mekanik</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
                    <span className="uppercase tracking-widest">Material</span>
                </div>
                
                <div className="ml-auto flex items-center gap-2 italic opacity-60">
                    <MdHistory size={14} />
                    <span>Last Update: {format(new Date(), "HH:mm")}</span>
                </div>
            </div>
        </div>
    )
}