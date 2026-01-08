import { runDomainTests } from "@/lib/test-domain"; // Sesuaikan pathnya
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { FaCheckCircle, FaTimesCircle, FaFlask } from "react-icons/fa";

export default function DebugDomainPage() {
  const results = runDomainTests();

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <MaxWidthWrapper>
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 p-8 text-white flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <FaFlask className="text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase">Domain Logic Tester</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Production Environment Simulation</p>
            </div>
          </div>

          {/* Table Test */}
          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    <th className="px-4 py-4">Input Host</th>
                    <th className="px-4 py-4">Expected Base</th>
                    <th className="px-4 py-4">Actual Result</th>
                    <th className="px-4 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {results.map((test, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-5 font-mono text-xs text-slate-600">{test.input}</td>
                      <td className="px-4 py-5 font-mono text-xs text-slate-400">{test.expected}</td>
                      <td className="px-4 py-5 font-mono text-xs font-bold text-blue-600">{test.result}</td>
                      <td className="px-4 py-5 text-center">
                        {test.isPass ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">
                            <FaCheckCircle /> Pass
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase">
                            <FaTimesCircle /> Fail
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase tracking-tight">
                    💡 <strong>Note:</strong> Tes ini memastikan bahwa saat aplikasi berjalan di Vercel, sistem dapat membedakan antara domain utama dan subdomain pelanggan secara otomatis.
                </p>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}