"use client"

import { useEffect, useState } from "react"
import { getDashboardStats } from "@/app/actions/dashboard-actions"
import { format, differenceInSeconds } from "date-fns"
import { FaClock, FaExclamationTriangle, FaCheckCircle, FaTools } from "react-icons/fa"

export default function RealtimeMonitor({ domain }: { domain: string }) {
    const [data, setData] = useState<any>(null)
    const [currentTime, setCurrentTime] = useState(new Date())

    // Clock Ticker
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 2000)
        return () => clearInterval(timer)
    }, [])

    // Data Polling
    useEffect(() => {
        const fetchData = async () => {
            const res = await getDashboardStats(domain)
            if (res.success) {
                setData(res.data)
            }
        }
        fetchData()
        const interval = setInterval(fetchData, 5000) // Poll every 5s
        return () => clearInterval(interval)
    }, [domain])

    if (!data) return (
        <div className="flex items-center justify-center h-full text-2xl text-muted-foreground animate-pulse">
            Connecting to {domain} Andon System...
        </div>
    )

    const activeColor = (status: string) => {
        return status === 'IN_PROGRESS'
            ? "bg-amber-100 border-amber-300 text-amber-900"
            : "bg-rose-100 border-rose-300 text-rose-900 animate-pulse"
    }
    console.log(data)

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-6 shadow-md flex justify-between items-center rounded-xl mb-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight uppercase flex items-center gap-3">
                        <span className="bg-white/20 p-2 rounded-lg"><FaTools /></span>
                        {data.adminName} Andon
                    </h1>
                    <p className="text-primary-foreground/80 font-mono mt-1 text-lg">Live Production Monitor</p>
                </div>
                <div className="text-right">
                    <div className="text-5xl font-mono font-bold tracking-widest">
                        {format(currentTime, "HH:mm:ss")}
                    </div>
                    <div className="text-xl opacity-90 uppercase tracking-widest">
                        {format(currentTime, "EEEE, dd MMM yyyy")}
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1 overflow-y-auto p-1">

                {/* Active Calls Cards */}
                {data.activeCalls.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center h-64 bg-green-50 border-2 border-green-200 border-dashed rounded-xl text-green-700">
                        <FaCheckCircle className="text-6xl mb-4 opacity-50" />
                        <h2 className="text-3xl font-bold">ALL SYSTEMS NORMAL</h2>
                        <p className="text-lg opacity-80">No active calls at this moment.</p>
                    </div>
                ) : (
                    data.activeCalls.map((call: any) => (
                        <div
                            key={call.id}
                            className={`rounded-xl border-l-[10px] p-6 shadow-lg flex flex-col justify-between h-[280px] relative overflow-hidden ${activeColor(call.status)}`}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <FaExclamationTriangle size={150} />
                            </div>

                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-black/10 px-3 py-1 rounded text-sm font-bold uppercase tracking-wider">
                                        {call.status.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs font-bold opacity-60">ID: {call.id.slice(-4)}</span>
                                </div>

                                <h2 className="text-4xl font-black leading-none mb-1">{call.machine.name}</h2>
                                <h3 className="text-xl font-semibold opacity-75 mb-6">{call.machine.location.name}</h3>

                                <div className="bg-white/30 p-3 rounded-lg backdrop-blur-sm">
                                    <p className="text-xs uppercase font-bold opacity-60 mb-1">REQ SUPPORT</p>
                                    <p className="text-2xl font-bold">{call.requestedRole}</p>
                                </div>
                            </div>

                            <div className="bg-black/20 text-white p-4 rounded-lg text-center mt-4">
                                <p className="text-xs uppercase font-bold opacity-70 mb-1">DOWNTIME</p>
                                <DowntimeTimer startTime={call.createdAt} />
                            </div>

                            {call.responder && (
                                <div className="absolute bottom-2 right-4 text-xs font-bold opacity-80">
                                    Handling: {call.responder.name}
                                </div>
                            )}
                        </div>
                    ))
                )}

            </div>

            {/* Footer Stats */}
            <div className="mt-6 grid grid-cols-4 gap-6">
                <StatCard label="Total Calls Today" value={data.stats.total} color="bg-card border-border text-foreground" />
                <StatCard label="Resolved Today" value={data.stats.resolved} color="bg-green-100 border-green-300 text-green-900" />
                <StatCard label="Active Issues" value={data.stats.open} color="bg-rose-100 border-rose-300 text-rose-900" />
                <StatCard label="Efficiency" value={`${data.stats.total > 0 ? Math.round((data.stats.resolved / data.stats.total) * 100) : 100}%`} color="bg-blue-100 border-blue-300 text-blue-900" />
            </div>
        </div>
    )
}

function StatCard({ label, value, color }: { label: string, value: string | number, color: string }) {
    return (
        <div className={`p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center ${color}`}>
            <div className="text-3xl font-black">{value}</div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</div>
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
        <div className="font-mono text-3xl font-bold tabular-nums">
            {hours.toString().padStart(2, '0')}:
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
        </div>
    )
}
