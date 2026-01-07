"use client";

import { useState } from "react";
import { addTeamMember } from "@/app/actions/team-actions";
import { useRouter } from "next/navigation";
import { FaUserPlus, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { MdOutlineEmail, MdBadge, MdLock, MdWork } from "react-icons/md";

export default function AddTeamForm({ adminId }: { adminId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      adminId,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      andonRole: formData.get("andonRole") as string,
    };

    const result = await addTeamMember(data);

    if (result.success) {
      setMessage("✅ Member baru berhasil ditambahkan ke tim!");
      (e.target as HTMLFormElement).reset();
      router.refresh();
      setTimeout(() => setMessage(""), 5000); // Hilangkan pesan setelah 5 detik
    } else {
      setMessage(`❌ ${result.error}`);
    }
    setLoading(false);
  }

  return (
    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 mb-8 shadow-inner">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
          <FaUserPlus className="text-white text-sm" />
        </div>
        <h3 className="font-black text-slate-800 italic uppercase tracking-tighter">
          Registrasi Anggota Tim Baru
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* INPUT NAMA */}
          <div className="relative group">
            <MdBadge className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              name="name" 
              placeholder="Nama Lengkap" 
              required 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
            />
          </div>

          {/* INPUT EMAIL */}
          <div className="relative group">
            <MdOutlineEmail className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              name="email" 
              type="email" 
              placeholder="Email Perusahaan" 
              required 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
            />
          </div>

          {/* INPUT PASSWORD */}
          <div className="relative group">
            <MdLock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              required 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
            />
          </div>

          {/* SELECT ROLE */}
          <div className="relative group">
            <MdWork className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <select
              name="andonRole"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="" disabled selected>Pilih Role</option>
              <option value="MEKANIK">🔧 MEKANIK</option>
              <option value="QUALITY">🔍 QUALITY</option>
              <option value="MATERIAL">📦 MATERIAL</option>
            </select>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full lg:w-max px-8 bg-slate-900 text-white py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Memproses...</span>
            </div>
          ) : (
            <>
              Tambah Anggota <FaUserPlus />
            </>
          )}
        </button>
      </form>

      {/* NOTIFIKASI */}
      {message && (
        <div className={`mt-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          message.startsWith('✅') 
          ? 'bg-green-50 border border-green-100 text-green-700' 
          : 'bg-red-50 border border-red-100 text-red-700'
        }`}>
          {message.startsWith('✅') ? <FaCheckCircle /> : <FaExclamationCircle />}
          <p className="text-sm font-bold uppercase tracking-tight">
            {message.replace('✅', '').replace('❌', '')}
          </p>
        </div>
      )}
    </div>
  );
}