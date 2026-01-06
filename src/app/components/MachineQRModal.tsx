"use client";

import QRGenerator from "./QRGenerator";

// import { QRCodeSVG } from "qrcode.react";

interface QRModalProps {
  machine: any;
  locationName: string;
  subdomain: string;
  onClose: () => void;
}

export default function MachineQRModal({ machine, locationName, subdomain, onClose }: QRModalProps) {
  if (!machine) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-99 p-4 backdrop-blur-sm animate-in fade-in duration-200">
        {/* Elemen ini yang akan dicetak (tambahkan kelas 'print-area') */}
        <div className="print-area bg-white p-8 rounded-3xl flex flex-col items-center gap-6 shadow-2xl max-w-sm w-full animate-in zoom-in duration-300">
          
          <div className="text-center">
            <h3 className="font-black text-zinc-900 uppercase tracking-widest text-lg">ANDON CALL POINT</h3>
            <p className="text-[10px] text-zinc-500 font-medium">Scan to Request Assistance</p>
          </div>

          {/* QR Generator */}

          {/* <div className="bg-white p-4 border-12 border-zinc-900 rounded-3xl shadow-inner">
            <QRCodeSVG 
              value={`${loginUrl}call?machineId=${machine.id}`} 
              size={180}
              level="H"
              marginSize={0}
            />
            <p className="text-xs text-center text-zinc-400">{`${loginUrl}call?machineId=${machine.id}`}</p>  
          </div> */}

          <div className="bg-white p-4 border-12 border-zinc-900 rounded-3xl shadow-inner">
          <QRGenerator subdomain={subdomain} machineId={machine.id}/>
          </div>



          <div className="w-full bg-rose-50 p-4 rounded-xl border border-rose-100 text-center">
            <p className="text-xs font-black text-rose-600 uppercase tracking-tighter">Machine: {machine.name}</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Location: {locationName}</p>
          </div>

          {/* Tombol ini akan disembunyikan saat cetak (tambahkan kelas 'no-print') */}
          <div className="flex flex-col w-full gap-2 no-print">
            <button 
              onClick={handlePrint} 
              className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
            >
              <span>🖨️</span> PRINT LABEL
            </button>
            <button 
              onClick={onClose} 
              className="w-full py-2 text-zinc-400 text-xs font-semibold hover:text-zinc-600 transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>

      {/* CSS Khusus Print */}
      <style jsx global>{`
        @media print {
          /* Sembunyikan semua elemen di halaman */
          body * {
            visibility: hidden;
          }
          /* Tampilkan hanya area modal */
          .print-area, .print-area * {
            visibility: visible;
          }
          /* Atur posisi area cetak agar di pojok kiri atas kertas */
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
            padding: 0;
            margin: 0;
          }
          /* Sembunyikan tombol aksi di dalam modal */
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}