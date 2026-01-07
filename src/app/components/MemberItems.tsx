"use client";

import { useState } from "react";
import { DeleteMemberButton } from "@/app/components/DeleteMemberBtn";
import { Button } from "@/app/components/ui/Button";
import { 
  FaUser, 
  FaEnvelope, 
  FaKey, 
  FaExternalLinkAlt, 
  FaCopy, 
  FaPaperPlane, 
  FaTimes,
  FaIdCard
} from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";

export default function MemberItem({ m, link }: { m: any, link: string }) {
  const [showModal, setShowModal] = useState(false);

  const copyAllData = () => {
    const textToCopy = `
DETAIL AKUN TEAM MEMBER ANDONPRO:
-------------------------
Nama      : ${m.member.name}
Email     : ${m.member.email}
Password  : ${m.lastPassword || "Belum diatur"}
Role      : ${m.role}
Link Login: ${link}login
-------------------------
Mohon segera login dan ganti password Anda demi keamanan.
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    alert("Berhasil menyalin semua detail akun!");
  };

  return (
    <>
      <div className="group flex items-center justify-between py-2 px-3 bg-white hover:bg-slate-50 border-b border-slate-100 transition-all rounded-lg mb-1">
        <div 
          className="flex items-center gap-3 cursor-pointer flex-1"
          onClick={() => setShowModal(true)}
        >
          <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FaUser size={12} />
          </div>
          <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors italic">
            {m.member.name}
          </p>
        </div>
        <DeleteMemberButton memberId={m.memberId} adminId={m.adminId} />
      </div>

      {/* Modal Detail */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-100 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center relative overflow-hidden">
              <MdOutlineSecurity className="absolute -right-4 -bottom-4 text-white/10 text-6xl" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <FaIdCard className="text-white" />
                </div>
                <div>
                  <h3 className="font-black italic tracking-tighter uppercase text-sm">Profil Anggota</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Member Credentials</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="bg-white/10 hover:bg-red-500 rounded-full p-2 transition-all relative z-10"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                {/* Row: Nama */}
                <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <FaUser className="text-slate-400 mt-1" />
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                    <p className="text-sm font-black text-slate-800 italic uppercase">{m.member.name}</p>
                  </div>
                </div>

                {/* Row: Email */}
                <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <FaEnvelope className="text-slate-400 mt-1" />
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Alamat Email</label>
                    <p className="text-sm font-bold text-slate-700">{m.member.email}</p>
                  </div>
                </div>

                {/* Row: Password */}
                <div className="flex items-start gap-4 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                  <FaKey className="text-blue-500 mt-1" />
                  <div>
                    <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Akses Password</label>
                    <p className="text-sm font-black text-blue-700 tracking-wider">
                      {m.lastPassword || "********"}
                    </p>
                  </div>
                </div>

                {/* Row: Link & Role */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Role Unit</label>
                    <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md tracking-tighter italic">
                      {m.role}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Link Login</label>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 truncate italic">
                      <FaExternalLinkAlt size={8} /> 
                      {/* Ganti user.domain dengan manipulasi string link 
                        atau cukup tampilkan teks statis karena 'link' sudah dipassing sebagai props
                      */}
                      {link.replace("https://", "").replace("http://", "")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={copyAllData}
                  className="bg-slate-900 text-white w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                >
                  <FaCopy /> Salin Semua Data
                </button>
                
                <button
                  onClick={() => {
                    const subject = encodeURIComponent("Akun AndonPro Anda");
                    const body = encodeURIComponent(`Halo ${m.member.name},\n\nDetail Akun Anda:\nEmail: ${m.member.email}\nPassword: ${m.lastPassword}\nLink: ${link}login`);
                    window.location.href = `mailto:${m.member.email}?subject=${subject}&body=${body}`;
                  }}
                  className="bg-white border-2 border-slate-200 text-slate-700 w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                >
                  <FaPaperPlane className="text-blue-500" /> Kirim via Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}