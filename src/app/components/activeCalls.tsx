"use client";

import React, { useEffect, useState } from 'react';
import { MdOutlinePrecisionManufacturing, MdTimer, MdLocationOn, MdGroups, MdSync } from 'react-icons/md';
import { RiAlertFill, RiLoader3Line } from 'react-icons/ri';
import { useRouter } from 'next/navigation';

interface ActiveCallListProps {
  activeCalls: any[]; 
}

export default function ActiveCallList({ activeCalls: initialCalls }: ActiveCallListProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // LOGIKA AUTO REFRESH (3 DETIK)
  useEffect(() => {
    const interval = setInterval(() => {
      // Menggunakan router.refresh() untuk memicu server action/fetch data terbaru 
      // tanpa menghilangkan state client atau scroll position
      setIsRefreshing(true);
      router.refresh();
      
      // Matikan indikator loading setelah jeda singkat
      setTimeout(() => setIsRefreshing(false), 500);
    }, 3000); // 3000ms = 3 detik

    return () => clearInterval(interval);
  }, [router]);

  if (!initialCalls || initialCalls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-dashed border-slate-100 relative">
        <MdOutlinePrecisionManufacturing size={48} className="text-slate-200 mb-4" />
        <p className="text-slate-400 font-medium tracking-tight">Tidak ada antrean panggilan aktif</p>
        {isRefreshing && (
           <MdSync className="absolute top-4 right-4 text-slate-300 animate-spin" />
        )}
      </div>
    );
  }

  // 1. Logika Pengelompokan berdasarkan Role
  const groupedByRole = initialCalls.reduce((acc: any, call) => {
    const role = call.requestedRole || "UNASSIGNED";
    if (!acc[role]) acc[role] = [];
    acc[role].push(call);
    return acc;
  }, {});

  return (
    <div className="space-y-12 relative">
      {/* Indikator Refresh Halus di Pojok Atas */}
      <div className={`fixed top-6 right-6 transition-opacity duration-300 ${isRefreshing ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
          <MdSync className="text-blue-600 animate-spin" size={14} />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Updating...</span>
        </div>
      </div>

      {Object.keys(groupedByRole).map((role) => {
        // 2. Logika Pengurutan: Lokasi (A-Z) lalu Waktu (Lama ke Baru)
        const sortedCalls = [...groupedByRole[role]].sort((a, b) => {
          const locA = a.machine.location.name.toLowerCase();
          const locB = b.machine.location.name.toLowerCase();
          if (locA < locB) return -1;
          if (locA > locB) return 1;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

        return (
          <div key={role} className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100">
                <MdGroups size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Tim {role} <span className="text-slate-300 ml-2">({sortedCalls.length})</span>
              </h2>
            </div>

            <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-[0.15em] border-b border-slate-100">
                      <th className="px-6 py-4 w-32">Status</th>
                      <th className="px-6 py-4">Lokasi</th>
                      <th className="px-6 py-4">Mesin</th>
                      <th className="px-6 py-4">Waktu Panggil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sortedCalls.map((call) => (
                      <tr key={call.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase
                            ${call.status === 'OPEN' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            {call.status === 'OPEN' ? <RiAlertFill size={12}/> : <RiLoader3Line size={12} className="animate-spin" />}
                            {call.status}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-800 font-bold">
                            <MdLocationOn size={16} className="text-blue-500" />
                            <span className="text-sm uppercase">{call.machine.location.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MdOutlinePrecisionManufacturing size={18} className="text-slate-300" />
                            <span className="text-sm font-medium">{call.machine.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-500 font-mono text-sm">
                            <MdTimer size={16} className="text-slate-300" />
                            {new Date(call.createdAt).toLocaleTimeString('id-ID', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </div>
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