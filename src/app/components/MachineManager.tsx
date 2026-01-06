"use client";

import { useState } from "react";
import { addMachine, deleteMachine } from "@/app/actions/machine-actions";
import { QRCodeSVG } from "qrcode.react";

export default function MachineManager({ locations, loginUrl }: { locations: any[], loginUrl: string }) {
  const [name, setName] = useState("");
  const [selectedLoc, setSelectedLoc] = useState("");
  const [showQR, setShowQR] = useState<any>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedLoc) return;
    await addMachine(name, selectedLoc);
    setName("");
  };

  return (
    <div className="bg-rose-100 w-full shadow-lg text-zinc-800 rounded-xl border-b-2 border-rose-300 overflow-hidden">
      <h2 className="font-semibold py-2 bg-rose-600 text-white p-4">MACHINES & QR CODE</h2>
      
      <div className="p-4">
        {/* Form Tambah Mesin */}
        <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-6 bg-white p-3 rounded-lg border border-rose-200">
          <select 
            className="p-2 text-sm border rounded"
            onChange={(e) => setSelectedLoc(e.target.value)}
            value={selectedLoc}
          >
            <option value="">Pilih Lokasi...</option>
            {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
          </select>
          <div className="flex gap-2">
            <input 
              className="flex-1 p-2 text-sm border rounded"
              placeholder="Nama Mesin (ex: CNC-01)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="bg-rose-600 text-white px-4 rounded font-bold">+</button>
          </div>
        </form>

        {/* Daftar Mesin Per Lokasi */}
        <div className="space-y-4 max-h-60 overflow-y-auto">
          {locations.map(loc => (
            <div key={loc.id}>
              <h4 className="text-[10px] font-bold text-rose-600 border-b border-rose-200 mb-1">{loc.name}</h4>
              {loc.machines?.map((mac: any) => (
                <div key={mac.id} className="flex justify-between items-center py-1 border-b border-zinc-200">
                  <span className="text-sm">{mac.name}</span>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowQR({ ...mac, locName: loc.name })}
                      className="text-[10px] bg-white border border-rose-300 px-2 py-0.5 rounded hover:bg-rose-50"
                    >
                      GET QR
                    </button>
                    <button onClick={() => deleteMachine(mac.id)} className="text-rose-500">×</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Modal QR Code */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4">
          <div className="bg-white p-6 rounded-2xl flex flex-col items-center gap-4 shadow-2xl max-w-sm w-full text-center">
            <h3 className="font-bold text-zinc-800 uppercase tracking-tight">QR CALL ANDON</h3>
            <div className="bg-white p-2 border-4 border-zinc-800 rounded-lg">
              <QRCodeSVG 
                value={`${loginUrl}/call?machineId=${showQR.id}`} 
                size={200}
                level="H"
              />
            </div>
            <div className="text-sm">
              <p className="font-bold text-rose-600">{showQR.name}</p>
              <p className="text-zinc-500 text-xs">{showQR.locName}</p>
            </div>
            <button 
              onClick={() => window.print()} 
              className="w-full bg-zinc-800 text-white py-2 rounded-lg font-bold text-sm"
            >
              PRINT QR CODE
            </button>
            <button onClick={() => setShowQR(null)} className="text-zinc-400 text-xs">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}