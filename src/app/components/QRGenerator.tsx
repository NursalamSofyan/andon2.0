"use client";

import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { getBaseUrl } from "@/utils/url-helper"; // Pastikan path import benar
import { useEffect, useState } from "react";

interface QRGeneratorProps {
  subdomain: string; // contoh: 'idm1' atau 'mekanik'
  machineId: string;
}

function QRGenerator({ subdomain, machineId }: QRGeneratorProps) {
  const [fullUrl, setFullUrl] = useState<string>("");

  useEffect(() => {
    const generatedUrl = getBaseUrl(subdomain, `/scan?machineId=${machineId}`);
    setFullUrl(generatedUrl);
  }, [subdomain, machineId]);

  // Hindari rendering jika URL belum siap (hydration safe)
  if (!fullUrl) return <div className="w-50 h-50 bg-slate-100 animate-pulse rounded-lg mx-auto" />;

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <QRCodeSVG 
          value={fullUrl} 
          size={200}
          level="H"
          className="mx-auto"
        />
      </div>
      
      <Link 
        href={fullUrl} 
        target="_blank"
        className="text-[10px] text-center text-zinc-400 max-w-62.5 break-all hover:text-blue-500 transition-colors font-mono"
      >
        {fullUrl}
      </Link>  
    </div>
  );
}

export default QRGenerator;