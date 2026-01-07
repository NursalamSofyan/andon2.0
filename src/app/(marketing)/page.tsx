import React from 'react'
import Link from 'next/link'
// Import icons dari react-icons
import { 
  FaArrowRight, 
  FaCheckCircle, 
  FaRegClock, 
  FaChartBar, 
  FaShieldAlt, 
  FaHeadset 
} from 'react-icons/fa'
import { MdOutlinePrecisionManufacturing, MdDevices, MdOutlineFactory, MdLocalPizza } from 'react-icons/md'
import { IoLocationOutline } from 'react-icons/io5'

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-900 font-sans tracking-tight">
      {/* NAVIGATION - Sekarang menggunakan Navbar terpisah yang kita buat sebelumnya, 
          tapi saya sertakan versi inline sederhana di sini agar file ini bisa langsung jalan */}
      {/* <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <MdOutlineFactory className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter italic">andonPro</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition">Fitur</a>
            <a href="#pricing" className="hover:text-blue-600 transition">Harga</a>
            <Link href="/login" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition">
              Coba Gratis
            </Link>
          </div>
        </div>
      </nav> */}

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            <MdLocalPizza className="animate-pulse" /> Professional Andon System with Ease
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
            Hentikan <span className="text-blue-600">Production Loss</span> <br />
            Mulai Sekarang.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            Teknisi terlambat datang? Data MTTR berantakan? andonPro memberikan visibilitas penuh pada lantai produksi Anda dalam hitungan menit.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-black flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-200 transition">
              Daftarkan Subdomain Anda <FaArrowRight />
            </Link>
            <Link href="#pricing" className="w-full sm:w-auto border border-slate-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition">
              Lihat Harga
            </Link>
          </div>
        </div>
      </section>

      {/* PAIN POINTS SECTION */}
      <section className="py-20 bg-slate-50" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 group hover:border-blue-500 transition-colors">
              <FaRegClock className="text-blue-600 mb-6 text-4xl group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-black mb-4 tracking-tight">Eliminasi Teknisi Terlambat</h3>
              <p className="text-slate-500 leading-relaxed">Notifikasi real-time langsung ke smartphone teknisi. Tidak ada lagi waktu terbuang mencari personil.</p>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 group hover:border-blue-500 transition-colors">
              <FaChartBar className="text-blue-600 mb-6 text-4xl group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-black mb-4 tracking-tight">Tracking MTBF & MTTR Otomatis</h3>
              <p className="text-slate-500 leading-relaxed">Lupakan pencatatan manual di kertas. Dapatkan laporan downtime akurat secara instan untuk Lean Management.</p>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 group hover:border-blue-500 transition-colors">
              <FaShieldAlt className="text-blue-600 mb-6 text-4xl group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-black mb-4 tracking-tight">Mencegah Downtime Berulang</h3>
              <p className="text-slate-500 leading-relaxed">Analisis data historis untuk melakukan preventive maintenance sebelum mesin benar-benar rusak.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-24 px-6" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Rencana Harga Transparan</h2>
            <p className="text-slate-500 text-lg">Investasi kecil untuk menyelamatkan jutaan rupiah Production Loss.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-end">
            {/* TRIAL */}
            <div className="p-8 rounded-3xl border border-slate-200 hover:shadow-lg transition">
              <h4 className="text-lg font-bold text-slate-400 mb-2 uppercase tracking-widest">Trial</h4>
              <div className="text-4xl font-black mb-6 tracking-tighter text-slate-900">Gratis</div>
              <ul className="space-y-4 mb-8 text-slate-600 font-medium">
                <li className="flex items-center gap-3"><IoLocationOutline className="text-blue-600 text-xl" /> 2 Lokasi</li>
                <li className="flex items-center gap-3"><MdOutlinePrecisionManufacturing className="text-blue-600 text-xl" /> 10 Mesin</li>
                <li className="flex items-center gap-3"><FaCheckCircle size={18} className="text-green-500" /> Core Andon System</li>
              </ul>
              <button className="w-full py-4 rounded-xl border-2 border-slate-900 font-black hover:bg-slate-900 hover:text-white transition uppercase text-sm tracking-widest">Mulai Sekarang</button>
            </div>

            {/* PRO */}
            <div className="p-10 rounded-3xl border-2 border-blue-600 bg-white shadow-2xl relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em]">Paling Populer</div>
              <h4 className="text-lg font-bold text-blue-600 mb-2 uppercase tracking-widest">Pro Plan</h4>
              <div className="text-5xl font-black mb-1 tracking-tighter">Rp 500k</div>
              <div className="text-sm font-bold text-slate-400 mb-8">per bulan</div>
              <ul className="space-y-4 mb-10 text-slate-700 font-medium">
                <li className="flex items-center gap-3"><IoLocationOutline className="text-blue-600 text-xl" /> 10 Lokasi</li>
                <li className="flex items-center gap-3"><MdOutlinePrecisionManufacturing className="text-blue-600 text-xl" /> 100 Mesin</li>
                <li className="flex items-center gap-3"><FaChartBar className="text-blue-600 text-xl" /> Dashboard Analytics</li>
                <li className="flex items-center gap-3"><FaHeadset className="text-blue-600 text-xl" /> Support 24/7</li>
              </ul>
              <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 transition uppercase text-sm tracking-widest shadow-lg shadow-blue-200">Pilih Pro</button>
            </div>

            {/* ENTERPRISE */}
            <div className="p-8 rounded-3xl border border-slate-200 bg-slate-900 text-white">
              <h4 className="text-lg font-bold text-slate-500 mb-2 uppercase tracking-widest">Enterprise</h4>
              <div className="text-4xl font-black mb-1 tracking-tighter">Rp 1.2jt</div>
              <div className="text-sm font-bold text-slate-500 mb-8 text-opacity-60">per bulan</div>
              <ul className="space-y-4 mb-8 text-slate-300 font-medium">
                <li className="flex items-center gap-3"><IoLocationOutline className="text-blue-400 text-xl" /> 100 Lokasi</li>
                <li className="flex items-center gap-3"><MdDevices className="text-blue-400 text-xl" /> Unlimited Machines</li>
                <li className="flex items-center gap-3"><FaCheckCircle className="text-blue-400 text-xl" /> Custom Reports</li>
                <li className="flex items-center gap-3"><MdOutlineFactory className="text-blue-400 text-xl" /> On-site Training</li>
              </ul>
              <button className="w-full py-4 rounded-xl bg-white text-slate-900 font-black hover:bg-slate-100 transition uppercase text-sm tracking-widest">Hubungi Sales</button>
            </div>
          </div>
          
          <div className="mt-12 text-center p-8 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center justify-center gap-4">
             <MdOutlinePrecisionManufacturing className="text-blue-600 text-3xl" />
             <p className="text-blue-800 font-bold">
               Butuh deployment di <strong>Local Server</strong>? 
               <a href="#" className="ml-2 underline hover:text-blue-600 transition">Klik di sini untuk konsultasi teknis.</a>
             </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 border-t border-slate-100 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-100 grayscale hover:grayscale-0 transition cursor-pointer">
            <MdOutlineFactory className="text-blue-600 text-2xl" />
            <span className="font-black text-xl tracking-tighter italic">andonPro</span>
          </div>
          <div className="flex gap-8 text-slate-400 text-sm font-bold">
            <a href="#" className="hover:text-slate-900 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition">Terms of Service</a>
          </div>
          <p className="text-slate-400 text-sm font-medium">© 2024 andonPro Automation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}