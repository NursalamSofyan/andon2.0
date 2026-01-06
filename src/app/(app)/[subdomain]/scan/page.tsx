"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getActiveCallForMachine } from "@/app/actions/call-actions";
import { checkMachineId } from "@/app/actions/machine-actions";
import { MdSync, MdQrCodeScanner } from "react-icons/md";

export default function ScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const machineId = searchParams.get("machineId");
  const [msg, setMsg] = useState("Menganalisa unit...");

  useEffect(() => {
    async function processScan() {
      if (!machineId) {
        setMsg("QR Code tidak valid.");
        return;
      }

      // 1. Validasi Mesin
      const machineRes = await checkMachineId(machineId);
      if (!machineRes.success) {
        setMsg("Mesin tidak terdaftar di sistem.");
        return;
      }

      // 2. Cek Aktivitas Panggilan
      const callRes = await getActiveCallForMachine(machineId);
      
      // Jika sukses dan ada data panggilan aktif
      if (callRes.success && callRes.data.length > 0) {
        setMsg("Ditemukan panggilan aktif. Mengalihkan...");
        // Arahkan ke CallContent (Halaman yang kita buat sebelumnya)
        // Halaman tersebut sudah punya logika internal untuk role-based UI
        router.replace(`/call?machineId=${machineId}`);
      } else {
        setMsg("Unit aman. Membuka menu panggil...");
        router.replace(`/call?machineId=${machineId}`);
      }
    }

    processScan();
  }, [machineId, router]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <MdQrCodeScanner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-blue-500" />
      </div>
      <h2 className="mt-8 font-black text-xl tracking-widest uppercase">andonPro</h2>
      <p className="mt-2 text-slate-400 font-medium text-sm animate-pulse">{msg}</p>
    </div>
  );
}