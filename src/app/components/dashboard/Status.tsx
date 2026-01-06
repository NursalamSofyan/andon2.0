"use client"

import { useEffect, useState } from "react"
import { getDashboardStats, getAllStatus } from "@/app/actions/dashboard-actions"
import { format, differenceInSeconds } from "date-fns"
import { FaClock, FaExclamationTriangle, FaCheckCircle, FaTools } from "react-icons/fa"

export default function Status({ domain }: { domain: string }) {
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
            const res = await getAllStatus(domain)
            setData(res)
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


            {/* Footer Stats */}

        <div className="flex flex-col gap-4">
          {data.map((loc: any) => (
              <div key={loc.id} className="grid grid-cols-8 gap-4 rounded-sm border p-4">
                <h3 className="font-bold">{loc.name}</h3>

                {loc.machines.map((m: any) => {
                const status = getMachineStatus(m)
                const bgColor = getBgColor(status)
                return (
                    <div
                    key={m.id}
                    className={`text-center p-2 border text-xs text-white ${bgColor}`}
                    >
                    {String(m.name).toUpperCase()}
                    </div>
                )
            })}
            </div>
            ))}
            </div>



        </div>
    )
}

function getMachineStatus(m: any) {
  if (!m.calls || m.calls.length === 0) return "NORMAL"

  const activeCall = m.calls.find(
    (c: any) => c.status === "OPEN" || c.status === "IN_PROGRESS"
  )

  if (!activeCall) return "NORMAL"

  return activeCall.status
}

function getBgColor(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-red-500"
    case "IN_PROGRESS":
      return "bg-yellow-500"
    default:
      return "bg-green-500"
  }
}
