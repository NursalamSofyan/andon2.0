"use client";

import { QRCodeSVG } from "qrcode.react";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import Link from "next/link";
import QRGenerator from "./QRGenerator";

export default function PrintQRClient({ 
  locations, 
  loginUrl,
  isFiltered 
}: { 
  locations: any[], 
  loginUrl: string,
  isFiltered: boolean
}) {
  return (
    <MaxWidthWrapper className="py-8 bg-white">
      <div className="flex justify-between items-center mb-8 bg-zinc-100 p-4 rounded-xl border border-zinc-200 print:hidden">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight">
            {isFiltered ? "Print Location QR" : "Bulk Print All QR"}
          </h1>
          <p className="text-xs text-zinc-500">
            {isFiltered 
              ? `Mencetak mesin untuk lokasi: ${locations[0]?.name || "-"}` 
              : "Mencetak semua mesin terdaftar."}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/settings" className="px-4 py-2 bg-white border rounded-lg text-xs font-bold hover:bg-zinc-50 transition-colors">
            KEMBALI
          </Link>
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-transform active:scale-95"
          >
            CETAK SEKARANG
          </button>
        </div>
      </div>

      {/* Grid QR */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
        {locations.map((loc) => 
          loc.machines.map((mac: any) => (
            <div 
              key={mac.id} 
              className="border-2 border-black rounded-2xl p-4 flex flex-col items-center gap-3 bg-white break-inside-avoid print:shadow-none"
            >
              <div className="text-center font-black text-[12px] uppercase">
                ANDON CALL POINT
              </div>

              {/* <div className="p-2 border-4 border-black rounded-xl">
                <QRCodeSVG 
                  value={`${loginUrl}call?machineId=${mac.id}`} 
                  size={140}
                  level="H"
                />
              </div> */}
              <div className="p-2 border-4 border-black rounded-xl">
              <QRGenerator subdomain={loginUrl} machineId={mac.id}/>
              </div>


              <div className="w-full text-center border-t border-zinc-200 pt-2">
                <p className="text-[10px] font-bold text-rose-600 uppercase">M: {mac.name}</p>
                <p className="text-[8px] text-zinc-500 font-bold uppercase truncate">L: {loc.name}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </MaxWidthWrapper>
  );
}