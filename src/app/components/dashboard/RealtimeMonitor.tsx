"use client"

import { useEffect, useState } from "react"
import { getDashboardStats } from "@/app/actions/dashboard-actions"
import { format } from "date-fns"
import { FaClock, FaExclamationTriangle, FaCheckCircle, FaTools, FaBroadcastTower } from "react-icons/fa"

export default function RealtimeMonitor({ domain }: { domain: string }) {
    const [data, setData] = useState<any>(null)
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const res = await getDashboardStats(domain)
            if (res.success) setData(res.data)
        }
        fetchData()
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
    }, [domain])

    if (!data) return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500 bg-slate-950">
            <FaBroadcastTower className="text-6xl animate-pulse text-blue-500" />
            <h2 className="text-xl font-black uppercase tracking-[0.3em] animate-pulse">Syncing Andon Node...</h2>
        </div>
    )

    const getStatusStyles = (status: string) => {
        if (status === 'IN_PROGRESS') {
            return "bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        }
        return "bg-rose-600/10 border-rose-600 text-rose-500 animate-pulse shadow-[0_0_30px_rgba(225,29,72,0.3)]"
    }

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-200">
            {/* Header: High Visibility Clock */}
            <div className="bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                        <FaTools className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-white">
                            {data.adminName} <span className="text-blue-500">Node</span>
                        </h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Live Telemetry Feed
                        </p>
                    </div>
                </div>
                
                <div className="text-right">
                    <div className="text-5xl font-mono font-black tracking-tighter text-white tabular-nums leading-none">
                        {format(currentTime, "HH:mm:ss")}
                    </div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">
                        {format(currentTime, "EEEE, dd MMMM yyyy")}
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {data.activeCalls.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center border-2 border-slate-800 border-dashed rounded-[3rem] bg-slate-900/20">
                        <div className="bg-green-500/10 p-8 rounded-full mb-6">
                            <FaCheckCircle className="text-green-500 text-7xl opacity-80" />
                        </div>
                        <h2 className="text-4xl font-black italic text-slate-700 tracking-tighter uppercase">No Active Alerts</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest mt-2">All Production Lines Stable</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {data.activeCalls.map((call: any) => (
                            <div
                                key={call.id}
                                className={`rounded-2xl border-2 p-6 flex flex-col justify-between h-80 relative overflow-hidden transition-all duration-500 ${getStatusStyles(call.status)}`}
                            >
                                {/* Decorative Icon */}
                                <FaExclamationTriangle className="absolute -right-6 -top-6 text-current opacity-5 text-9xl rotate-12" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${call.status === 'IN_PROGRESS' ? 'border-amber-500/50' : 'border-rose-500/50 bg-rose-500 text-white'}`}>
                                            {call.status.replace('_', ' ')}
                                        </span>
                                        <span className="font-mono text-[10px] opacity-50 font-bold">#ID-{call.id.slice(-4)}</span>
                                    </div>

                                    <h2 className="text-4xl font-black leading-none mb-1 tracking-tighter italic uppercase truncate">
                                        {call.machine.name}
                                    </h2>
                                    <h3 className="text-sm font-bold opacity-60 uppercase tracking-wider mb-6">
                                        Line: {call.machine.location.name}
                                    </h3>

                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <p className="text-[9px] uppercase font-black opacity-50 mb-2 tracking-[0.2em]">Required Support</p>
                                        <p className="text-xl font-black italic text-white uppercase">{call.requestedRole}</p>
                                    </div>
                                </div>

                                <div className="mt-4 bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[9px] uppercase font-black opacity-40 mb-1 text-center tracking-widest">Downtime Duration</p>
                                    <DowntimeTimer startTime={call.createdAt} />
                                </div>

                                {call.responder && (
                                    <div className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter opacity-80">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                        Handling: {call.responder.name}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Stats Grid */}
            <div className="p-6 bg-slate-900 border-t border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total (24h)" value={data.stats.total} theme="slate" />
                <StatCard label="Resolved" value={data.stats.resolved} theme="green" />
                <StatCard label="Active" value={data.stats.open} theme="rose" />
                <StatCard label="OEE Efficiency" value={`${data.stats.total > 0 ? Math.round((data.stats.resolved / data.stats.total) * 100) : 100}%`} theme="blue" />
            </div>
        </div>
    )
}

function StatCard({ label, value, theme }: { label: string, value: string | number, theme: string }) {
    const themes: any = {
        slate: "bg-slate-800/50 border-slate-700 text-slate-300",
        green: "bg-green-500/10 border-green-500/20 text-green-500",
        rose: "bg-rose-500/10 border-rose-500/20 text-rose-500",
        blue: "bg-blue-500/10 border-blue-500/20 text-blue-400"
    }
    return (
        <div className={`p-4 rounded-2xl border transition-all duration-500 ${themes[theme]}`}>
            <div className="text-3xl font-black italic tracking-tighter leading-none">{value}</div>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] mt-2 opacity-60">{label}</div>
        </div>
    )
}

function DowntimeTimer({ startTime }: { startTime: string }) {
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        const start = new Date(startTime).getTime()
        const update = () => {
            const now = new Date().getTime()
            setElapsed(Math.floor((now - start) / 1000))
        }
        update()
        const timer = setInterval(update, 1000)
        return () => clearInterval(timer)
    }, [startTime])

    const hours = Math.floor(elapsed / 3600)
    const minutes = Math.floor((elapsed % 3600) / 60)
    const seconds = elapsed % 60

    return (
        <div className="font-mono text-3xl font-black tabular-nums text-white text-center leading-none tracking-tighter">
            {hours.toString().padStart(2, '0')}:
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
        </div>
    )
}