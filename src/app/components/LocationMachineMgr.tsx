"use client";

import { useState } from "react";
import { deleteLocation } from "@/app/actions/location-actions";
import { addMachine, deleteMachine } from "@/app/actions/machine-actions";
import AddLocationForm from "./AddLocationForm";
import { MdDeleteForever } from "react-icons/md";
import { BsQrCodeScan } from "react-icons/bs";
import { TbManualGearbox } from "react-icons/tb";
import MachineQRModal from "./MachineQRModal";
import Link from "next/link";



export default function LocationMachineManager({ 
  initialLocations, 
  adminId,
  subdomain
}: { 
  initialLocations: any[], 
  adminId: string,
  subdomain: string,
}) {
  // State untuk melacak lokasi mana yang dipilih
  const [machineName, setMachineName] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [activeQRMachine, setActiveQRMachine] = useState<any>(null); // State untuk modal

  // Cari data lokasi aktif dari props terbaru berdasarkan ID yang dipilih
  const selectedLocation = initialLocations.find(l => l.id === selectedLocationId);

  const handleAddMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineName || !selectedLocation) return;
    await addMachine(machineName, selectedLocation.id);
    setMachineName("");
    // Opsional: Refresh data lokal atau andalkan revalidatePath
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-140">
      
      {/* KARTU LOKASI (HIJAU) */}
      <div className="bg-green-50 rounded-xl shadow-lg border-b-2 border-green-300 overflow-hidden">
        <h2 className="bg-green-600 text-white p-4 font-bold uppercase text-sm">Locations</h2>
        <AddLocationForm adminId={adminId} />
        
        <div className="p-4 space-y-2">
          {initialLocations.map((loc) => (
            <div 
              key={loc.id}
              onClick={() => setSelectedLocationId(loc.id)}
              className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-all border ${
                selectedLocation?.id === loc.id 
                ? "bg-green-200 border-green-500 shadow-sm" 
                : "bg-white border-transparent hover:bg-green-100"
              }`}
            >
              <span className="text-sm font-medium">{loc.name}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteLocation(loc.id); }}
                className="text-rose-500 hover:scale-125 px-2"
                title="Delete Location"
              >
                <MdDeleteForever size={14}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* KARTU MESIN (MERAH) */}
      <div className="bg-rose-50 rounded-xl shadow-lg border-b-2 border-rose-300 overflow-hidden">
        <h2 className="bg-rose-600 text-white p-4 font-bold uppercase text-sm">
          Machines / Calling Point QR Code
        </h2>
        
        {!selectedLocation ? (
          <div className="p-10 text-center text-zinc-400 italic text-sm">
            Klik salah satu lokasi di samping untuk melihat daftar mesin
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center bg-rose-200 p-2 ">
                <div>
                    <p className="text-[10px] font-bold text-rose-600 uppercase">
                    Location : {selectedLocation.name}
                    </p>
                    <p className="text-zinc-700">
                    Total Machines : {selectedLocation.machines?.length}  
                    </p>
                </div>
                <button className="p-1" title="Show All QR Code in Location ">
                <Link href={`/dashboard/settings/print-qr?locationId=${selectedLocation.id}`}>
                    <BsQrCodeScan size={20} className="text-rose-500"/>
                </Link>
                </button>
            </div>

            {/* Form Tambah Mesin */}
            <form onSubmit={handleAddMachine} className="flex gap-2">
              <input 
                value={machineName}
                onChange={(e) => setMachineName(e.target.value)}
                placeholder={`Add Machines to ${selectedLocation.name}`}
                className="flex-1 p-2 text-sm border border-rose-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button className="bg-rose-600 text-white px-4 rounded-lg font-bold" title="Add Machine"><TbManualGearbox size={16}/></button>
            </form>

            {/* List Mesin yang difilter berdasarkan lokasi yang diklik */}
            <div className="space-y-2">
              {selectedLocation.machines?.map((mac: any) => (
                <div key={mac.id} className="bg-white border-b border-rose-200 flex items-center justify-between p-2 rounded shadow-sm">
                  <span className="text-sm">{mac.name}</span>
                  <div className="flex gap-2">
                    <button 
                    className="text-[10px] text-zinc-600 font-bold underline" 
                    title="Show QR Code"
                    onClick={()=> setActiveQRMachine(mac)} ><BsQrCodeScan size={12}/></button>
                    <button onClick={() => deleteMachine(mac.id)} className="text-rose-500 hover:scale-125 px-2" title="Delete Machine"><MdDeleteForever size={14}/></button>
                  </div>
                  {/* MODAL REFACTORED */}
                <MachineQRModal 
                    machine={activeQRMachine}
                    locationName={selectedLocation?.name || ""}
                    subdomain={subdomain}
                    onClose={() => setActiveQRMachine(null)}
                />
                </div>
              ))}
              {selectedLocation.machines?.length === 0 && (
                <p className="text-xs text-zinc-400 italic">Belum ada mesin di lokasi ini.</p>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}