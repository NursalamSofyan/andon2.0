"use client";

import React, { useEffect, useState, useRef } from 'react';
import { MdOutlinePrecisionManufacturing, MdTimer, MdLocationOn, MdGroups, MdSync } from 'react-icons/md';
import { RiAlertFill, RiLoader3Line } from 'react-icons/ri';
import { useRouter } from 'next/navigation';

interface ActiveCallListProps {
  activeCalls: any[]; 
}

export default function AnnounceCallList({ activeCalls: initialCalls }: ActiveCallListProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // useRef digunakan untuk menyimpan data tanpa memicu re-render
  const announcedIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);

  // --- LOGIKA TEXT TO SPEECH ---
const speakAnnouncement = (text: string) => {
    // if (isMuted) return;

    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Ambil semua suara yang tersedia di browser/OS
      const voices = synth.getVoices();
      
      const femaleVoice = voices.find(voice => 
        (voice.lang.includes('id-ID') && 
          (voice.name.includes('Female') || 
           voice.name.includes('Google') || // Google Indonesia biasanya wanita
           voice.name.includes('Gadis') || 
           voice.name.includes('Indah') ||
           voice.name.includes('Zira'))) 
      );

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else {
        const fallbackVoice = voices.find(v => v.lang.includes('id-ID'));
        if (fallbackVoice) utterance.voice = fallbackVoice;
      }

      utterance.lang = 'id-ID';
      utterance.rate = 1;
      utterance.pitch = 1.2; // Sedikit menaikkan pitch agar terdengar lebih feminin
      
      synth.speak(utterance);
    }
  };
  // --- DETEKSI PANGGILAN BARU ---
  useEffect(() => {
    initialCalls.forEach((call) => {
      if (!announcedIds.current.has(call.id)) {
        const message = `Panggilan kepada ${call.requestedRole} di mesin ${call.machine.name}, lokasi ${call.machine.location.name}`;
        
        speakAnnouncement(message);
        console.log("speak")
        announcedIds.current.add(call.id);
      }
    });

    // Setelah pemrosesan pertama selesai, set flag firstLoad ke false
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
    }
  }, [initialCalls]);

  // --- LOGIKA AUTO REFRESH (3 DETIK) ---
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      router.refresh();
      setTimeout(() => setIsRefreshing(false), 500);
    }, 3000);

    return () => {
      clearInterval(interval);
      window.speechSynthesis.cancel(); // Bersihkan suara saat pindah halaman
    };
  }, [router]);

  if (!initialCalls || initialCalls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-dashed border-slate-100 relative">
        <MdOutlinePrecisionManufacturing size={48} className="text-slate-200 mb-4" />
        <p className="text-slate-400 font-medium tracking-tight">Tidak ada antrean panggilan aktif</p>
        {isRefreshing && <MdSync className="absolute top-4 right-4 text-slate-300 animate-spin" />}
      </div>
    );
  }

  // ... (Logika Grouping & Rendering Table tetap sama seperti sebelumnya)
  const groupedByRole = initialCalls.reduce((acc: any, call) => {
    const role = call.requestedRole || "UNASSIGNED";
    if (!acc[role]) acc[role] = [];
    acc[role].push(call);
    return acc;
  }, {});

  return (
    <div className="space-y-12 relative">
       {/* Indikator Refresh */}
       <div className={`fixed top-6 right-6 transition-opacity duration-300 ${isRefreshing ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
          <MdSync className="text-blue-600 animate-spin" size={14} />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live Updates...</span>
        </div>
      </div>

      {Object.keys(groupedByRole).map((role) => {
        const sortedCalls = [...groupedByRole[role]].sort((a, b) => {
          const locA = a.machine.location.name.toLowerCase();
          const locB = b.machine.location.name.toLowerCase();
          if (locA < locB) return -1;
          if (locA > locB) return 1;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

        return (
          <div key={role} className="space-y-4">

             <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        {/* THEAD & TBODY anda */}
                        <tbody className="divide-y divide-slate-50">
                            {sortedCalls.map((call) => (
                                <tr key={call.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase
                                            ${call.status === 'OPEN' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {call.status === 'OPEN' ? <RiAlertFill size={12}/> : <RiLoader3Line size={12} className="animate-spin" />}
                                            {call.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold uppercase text-sm">{call.machine.location.name}</td>
                                    <td className="px-6 py-4 text-sm">{call.machine.name}</td>
                                    <td className="px-6 py-4 font-mono text-sm">
                                        {new Date(call.createdAt).toLocaleTimeString('id-ID')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
          </div>
        );
      })}
    </div>
  );
}