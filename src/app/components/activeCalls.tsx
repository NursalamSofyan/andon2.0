"use client";

import React, { useEffect, useState } from 'react';
import { MdOutlinePrecisionManufacturing, MdTimer, MdLocationOn, MdGroups, MdSync } from 'react-icons/md';
import { RiAlertFill, RiLoader3Line, RiInformationFill } from 'react-icons/ri';
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
      setIsRefreshing(true);
      router.refresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }, 15000);

    return () => clearInterval(interval);
  }, [router]);

  if (!initialCalls || initialCalls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 relative overflow-hidden">
        <div className="bg-white p-6 rounded-full shadow-xl shadow-slate-200/50 mb-6">
          <MdOutlinePrecisionManufacturing size={48} className="text-slate-300" />
        </div>
        <h3 className="text-slate-900 font-black text-xl tracking-tight mb-2">Lantai Produksi Aman</h3>
        <p className="text-slate-400 font-medium italic">Tidak ada antrean panggilan aktif saat ini.</p>
        
        {isRefreshing && (
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <MdSync className="text-blue-600 animate-spin" size={16} />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Scanning</span>
          </div>
        )}
      </div>
    );
  }

  const groupedByRole = initialCalls.reduce((acc: any, call) => {
    const role = call.requestedRole || "UNASSIGNED";
    if (!acc[role]) acc[role] = [];
    acc[role].push(call);
    return acc;
  }, {});

  return (
    <div className="space-y-12 relative">
      {/* Update Indicator Overlay */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 transform ${isRefreshing ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 border border-slate-700">
          <MdSync className="text-blue-400 animate-spin" size={18} />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Live Syncing</span>
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
          <div key={role} className="space-y-6">
            {/* Group Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 px-2">
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 p-3 rounded-2xl shadow-lg shadow-slate-200">
                  <MdGroups size={24} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">
                    Tim {role}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {sortedCalls.length} Panggilan Menunggu
                  </p>
                </div>
              </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase border-b border-slate-100">
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5">Lokasi Area</th>
                      <th className="px-8 py-5">Identitas Mesin</th>
                      <th className="px-8 py-5">Waktu Panggil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sortedCalls.map((call) => (
                      <tr key={call.id} className="hover:bg-blue-50/30 transition-all group">
                        <td className="px-8 py-6">
                          <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-xl text-[11px] font-black tracking-widest uppercase shadow-sm
                            ${call.status === 'OPEN' 
                              ? 'bg-red-600 text-white ring-4 ring-red-100' 
                              : 'bg-amber-500 text-white ring-4 ring-amber-100'}`}>
                            {call.status === 'OPEN' ? <RiAlertFill size={14} className="animate-pulse"/> : <RiLoader3Line size={14} className="animate-spin" />}
                            {call.status}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <MdLocationOn size={18} />
                            </div>
                            <span className="text-sm font-black text-slate-700 uppercase tracking-tight italic">{call.machine.location.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                               <MdOutlinePrecisionManufacturing size={18} className="text-slate-400" />
                            </div>
                            <span className="text-sm font-bold text-slate-600 tracking-tight">{call.machine.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 font-mono text-xs font-bold shadow-inner">
                            <MdTimer size={16} className="text-blue-500" />
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