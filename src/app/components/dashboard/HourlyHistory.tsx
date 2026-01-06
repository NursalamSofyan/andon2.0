"use client"

import { useEffect, useState } from "react"
import { getHourlyHistory } from "@/app/actions/dashboard-actions"
import { format } from "date-fns"

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
        const interval = setInterval(fetchData, 60000) // Update every minute
        return () => clearInterval(interval)
    }, [domain])

    if (loading) return <div className="text-muted-foreground animate-pulse">Loading history...</div>

    // Find max value for scaling bar heights
    let maxCount = 0
    Object.values(history).forEach(hourData => {
        const total = Object.values(hourData).reduce((a, b) => a + b, 0)
        if (total > maxCount) maxCount = total
    })
    if (maxCount === 0) maxCount = 1

    const hours = Object.keys(history).sort()

    return (
        <div className="bg-card w-full h-full rounded-xl border border-border p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-primary mb-4">Hourly Call History</h3>

            <div className="flex-1 flex items-end gap-2 overflow-x-auto pb-2 min-h-[200px]">
                {hours.map((hour) => {
                    const data = history[hour] || {}
                    const roles = Object.keys(data)
                    const total = Object.values(data).reduce((a, b) => a + b, 0)

                    return (
                        <div key={hour} className="flex flex-col items-center gap-2 group flex-1">
                            {/* Stacked Bar */}
                            <div className="w-full min-w-[30px] bg-muted/30 rounded-t-md relative flex flex-col-reverse overflow-hidden hover:bg-muted/50 transition-colors h-[200px]">
                                {/* Tooltip on hover */}
                                {total > 0 && (
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                                        <p className="font-bold border-b border-border mb-1">{hour}</p>
                                        {roles.map(r => (
                                            <div key={r} className="flex justify-between gap-4">
                                                <span>{r}</span>
                                                <span className="font-mono font-bold">{data[r]}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Render bars for each role */}
                                {roles.map((role, idx) => {
                                    const count = data[role]
                                    const heightPerc = (count / maxCount) * 100
                                    // quick deterministic color based on role string length/charcode
                                    const colors = [
                                        "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-rose-500", "bg-cyan-500", "bg-amber-500"
                                    ]
                                    const colorClass = colors[role.charCodeAt(0) % colors.length]

                                    return (
                                        <div
                                            key={role}
                                            style={{ height: `${heightPerc}%` }}
                                            className={`${colorClass} w-full opacity-90 hover:opacity-100 border-t border-white/20`}
                                        />
                                    )
                                })}
                            </div>
                            <span className="text-[10px] text-muted-foreground font-mono -rotate-45 origin-left mt-2">{hour}</span>
                        </div>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground border-t border-border pt-2">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Quality</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div> Mechanic</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> Material</span>
                <span className="italic opacity-50 ml-auto">Updated: {format(new Date(), "HH:mm")}</span>
            </div>
        </div>
    )
}
