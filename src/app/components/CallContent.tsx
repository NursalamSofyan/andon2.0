"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { checkMachineId } from "@/app/actions/machine-actions";
import { createCall, acceptCall, getActiveCallForMachine, resolveCall } from "@/app/actions/call-actions"; 
import { MdSync, MdOutlinePrecisionManufacturing, MdOutlineNotificationsActive, MdPerson, MdLogout } from 'react-icons/md';
import { RiShieldCheckFill, RiErrorWarningLine } from 'react-icons/ri';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { signOut } from 'next-auth/react';
import { getBaseUrl } from '@/utils/url-helper';

interface CallContentProps {
  menu: string[];
  userTeamRole: string | null;
  userId: string | undefined;
  userName: string | null;  
}

export default function CallContent({ menu, userTeamRole, userId, userName }: CallContentProps) {
  const searchParams = useSearchParams();
  const machineId = searchParams.get('machineId');

  const [dbStatus, setDbStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [machineData, setMachineData] = useState<any>(null);
  const [loadingAction, setLoadingAction] = useState(false); 
  const [activeCalls, setActiveCalls] = useState<any[]>([]);
  
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // LOGIKA PENCARIAN TUGAS (RESPONDER)
  const incomingCallForMe = activeCalls.find(
    (call) => call.requestedRole === userTeamRole && call.status === "OPEN"
  );

  const inProgressCallForMe = activeCalls.find(
    (call) => call.requestedRole === userTeamRole && call.status === "IN_PROGRESS"
  );

useEffect(() => {
  async function init() {
    if (!machineId) {
      setDbStatus('invalid');
      return;
    }

    const [machineRes, callRes] = await Promise.all([
      checkMachineId(machineId),
      getActiveCallForMachine(machineId) 
    ]);

    if (machineRes?.success) {
      setMachineData(machineRes.data);
      setDbStatus('valid');
      if (callRes?.success) setActiveCalls(callRes.data);
    } else {
      setDbStatus('invalid');
    }
  }

  // Jalankan init pertama kali
  init();
  fetchLocation();

  // Set interval untuk refresh setiap 30 detik
  const intervalId = setInterval(() => {
    init();
  }, 15000); // 30000 ms = 30 detik

  // Cleanup interval saat component unmount atau machineId berubah
  return () => clearInterval(intervalId);

}, [machineId]);

const fetchLocation = () => {
  if (!navigator.geolocation) {
    console.error("Geolocation tidak didukung oleh browser ini.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    (err) => {
      // Menangani error berdasarkan kode spesifik
      switch (err.code) {
        case err.PERMISSION_DENIED:
          console.warn("User menolak akses lokasi.");
          break;
        case err.POSITION_UNAVAILABLE:
          console.warn("Informasi lokasi tidak tersedia.");
          break;
        case err.TIMEOUT:
          console.warn("Permintaan lokasi timeout.");
          break;
        default:
          console.error("Terjadi error lokasi yang tidak diketahui:", err.message);
      }
    },
    { 
      enableHighAccuracy: true, 
      timeout: 5000, // Tambahkan timeout agar tidak menggantung
      maximumAge: 0 
    }
  );
};

  const handleLogout = async () => {
    const fullLoginUrl = getBaseUrl(userTeamRole?.toLowerCase(), "/login");
    await signOut({ redirect: true, callbackUrl: fullLoginUrl });
  };

  const handleCallInitiation = async (roleName: string) => {
    setLoadingAction(true);
    try {
      const result = await createCall(machineId!, roleName, location);
      if (result.success) window.location.reload(); 
      else alert(result.message);
    } catch (error) {
      alert("Gagal membuat panggilan.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleArrived = async () => {
    if (!incomingCallForMe || !userId) return;
    setLoadingAction(true);
    try {
      const res = await acceptCall(incomingCallForMe.id, userId);
      if (res.success) window.location.reload();
    } catch (error) {
      alert("Gagal konfirmasi kedatangan.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleResolve = async () => {
    if (!inProgressCallForMe) return;
    setLoadingAction(true);
    try {
      const res = await resolveCall(inProgressCallForMe.id); 
      if (res.success) window.location.reload();
    } catch (error) {
      alert("Gagal menyelesaikan panggilan.");
    } finally {
      setLoadingAction(false);
    }
  };

  if (dbStatus === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <MdSync className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Verifikasi Node andonPro</p>
      </div>
    );
  }

  if (dbStatus === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
        <div className="bg-white p-8 rounded-4xl shadow-xl border border-red-100 max-w-sm">
          <RiErrorWarningLine className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Unit Tidak Dikenali</h2>
          <p className="text-slate-500 mt-2 text-sm">ID Mesin tidak valid atau belum terdaftar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-4xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* User Profile Bar */}
        {userName && (
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 uppercase font-bold text-xs">
                {userName.charAt(0)}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-[11px] font-black text-slate-800 truncate leading-tight uppercase">{userName}</span>
                <span className="text-[9px] text-slate-500 font-bold tracking-wider">{userTeamRole}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors">
              <MdLogout size={18} />
            </button>
          </div>
        )}
        
        {/* Machine Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl">
            <MdOutlinePrecisionManufacturing size={24} />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase leading-tight">{machineData?.name}</h3>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wide">LOC: {machineData?.location?.name}</p>
          </div>
        </div>

        <div className="p-6">
          {/* LOGIKA TOMBOL BERDASARKAN STATUS & ROLE */}
          {incomingCallForMe ? (
            /* CASE 1: ADA PANGGILAN MASUK UNTUK SAYA */
            <div className="space-y-4 text-center">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 animate-pulse">
                <p className="text-amber-700 text-xs font-bold uppercase">Tugas: {userTeamRole}</p>
                <p className="text-slate-600 text-[10px]">Silakan konfirmasi jika sudah tiba di lokasi.</p>
              </div>
              <button
                disabled={loadingAction}
                onClick={handleArrived}
                className="w-full bg-blue-600 text-white p-6 rounded-3xl font-black text-xl shadow-xl active:scale-95 transition-all disabled:opacity-50"
              >
                {loadingAction ? "PROSES..." : "SAYA SUDAH TIBA"}
              </button>
            </div>
          ) : inProgressCallForMe ? (
            /* CASE 2: SAYA SEDANG MENGERJAKAN TUGAS (IN_PROGRESS) */
            <div className="space-y-4 text-center">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-emerald-700 text-xs font-bold uppercase">Sedang Diperbaiki</p>
                <p className="text-slate-600 text-[10px]">Tekan tombol jika perbaikan sudah selesai.</p>
              </div>
              <button
                disabled={loadingAction}
                onClick={handleResolve}
                className="w-full bg-emerald-600 text-white p-6 rounded-3xl font-black text-xl shadow-xl shadow-emerald-100 active:scale-95 transition-all disabled:opacity-50"
              >
                {loadingAction ? "MENYIMPAN..." : "SELESAIKAN TUGAS"}
              </button>
            </div>
          ) : (
            /* CASE 3: TAMPILAN STANDAR PILIH DEPARTEMEN (GUEST/OPERATOR) */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <HiOutlineUserGroup size={16}/>
                <span className="text-[10px] font-bold uppercase tracking-widest">Pilih Departemen</span>
              </div>

              <div className="grid gap-3">
                {menu.map((role) => {
                  const call = activeCalls.find(c => c.requestedRole === role);
                  const isActive = !!call;
                  const isInProgress = call?.status === "IN_PROGRESS";

                  return (
                    <button 
                      key={role} 
                      disabled={isActive || loadingAction}
                      onClick={() => handleCallInitiation(role)}
                      className={`w-full flex items-center p-4 border-2 rounded-3xl transition-all 
                        ${isActive 
                          ? isInProgress ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
                          : "border-slate-50 bg-slate-50/50 active:scale-95 hover:border-blue-200"
                        }`}
                    >
                      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center 
                        ${isActive 
                          ? isInProgress ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                          : "bg-white text-blue-600 shadow-sm"
                        }`}>
                        <MdOutlineNotificationsActive size={20} className={isActive && !isInProgress ? "animate-bounce" : ""} />
                      </div>

                      <div className="ml-4 text-left">
                        <p className={`font-extrabold text-sm uppercase ${isActive ? isInProgress ? "text-emerald-700" : "text-amber-700" : "text-slate-800"}`}>
                          {role}
                        </p>
                        <p className="text-[10px] font-medium uppercase tracking-tight">
                          {isActive 
                            ? isInProgress ? "Petugas sedang menangani" : "Sedang dipanggil..." 
                            : `Panggil ${role.toLowerCase()}`
                          }
                        </p>
                      </div>
                      
                      {isInProgress && <RiShieldCheckFill className="ml-auto text-emerald-500 text-xl" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-8 text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">AndonPro Industrial System</p>
    </div>
  );
}