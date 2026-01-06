
import RealtimeMonitor from "@/app/components/dashboard/RealtimeMonitor"
import HourlyHistory from "@/app/components/dashboard/HourlyHistory"
import Status from "@/app/components/dashboard/Status"

export default async function DashboardPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain } = await params

    return (
        <div className="min-h-screen bg-zinc-50 p-4 lg:p-6 flex flex-col gap-6 overflow-hidden max-h-screen">
            {/* <div className="flex-1 overflow-hidden">
                <RealtimeMonitor domain={domain} />
            </div> */}

            <Status domain={domain} />

            <div className="h-[300px] shrink-0">
                <HourlyHistory domain={domain} />
            </div>

            <div className="fixed bottom-2 right-2 flex items-center gap-2 text-[10px] text-zinc-400 opacity-50 pointer-events-none">
                <span className="bg-zinc-200 px-1 rounded">DOMAIN: {domain}</span>
                <span>AndonPro Dashboard v1.0</span>
            </div>
        </div>
    )
}
