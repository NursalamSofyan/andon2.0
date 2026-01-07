import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSubdomainLink } from "@/lib/subdomain";
import { validateUserStatus } from "@/lib/auth-helpers";
import { getAllActiveCalls } from "@/app/actions/call-actions";
import ActiveCallList from "@/app/components/activeCalls";
import { FaExternalLinkAlt, FaUserCircle, FaExclamationTriangle, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { MdOutlineFactory } from "react-icons/md";

const DashboardPage = async () => {
  const { session, user } = await validateUserStatus();

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // Tampilan jika belum ada subdomain (Empty State)
  if (!user?.domain) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center px-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-10 flex flex-col items-center justify-center shadow-xl shadow-slate-200/50 max-w-lg text-center">
          <div className="bg-amber-100 p-4 rounded-full mb-6">
            <FaExclamationTriangle className="text-amber-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Subdomain Belum Terdaftar</h2>
          <p className="text-slate-500 font-medium mb-8">
            Anda belum mendaftarkan subdomain andonPro untuk perusahaan Anda. Silakan buat sekarang untuk mulai menggunakan sistem.
          </p>
          <Link
            href="/createsubdomain"
            className="bg-blue-600 px-8 py-4 rounded-xl text-white font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-3"
          >
            Buat Subdomain Baru <FaExternalLinkAlt size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const fullSubdomainLink = await getSubdomainLink(user.domain);
  const activeCalls = await getAllActiveCalls();

  return (
    <div className="bg-slate-50 min-h-screen pt-6 pb-12">
      <MaxWidthWrapper className="flex flex-col gap-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Dashboard</h1>
            <p className="text-slate-500 font-medium">Selamat datang kembali, {user.name?.split(' ')[0]}</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
            <div className="bg-green-100 p-2 rounded-lg">
              <FaCheckCircle className="text-green-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Status Akun</p>
              <p className="text-sm font-bold text-slate-700 leading-none">{user.status || "Aktif"}</p>
            </div>
          </div>
        </div>

        {/* GRID USER INFORMATION */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white shadow-xl shadow-slate-200/50 text-slate-800 rounded-3xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white">
              <FaUserCircle className="text-xl text-blue-400" />
              <h2 className="font-black text-sm uppercase tracking-widest">Informasi Pengguna</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Nama & Email</label>
                <p className="font-bold text-slate-700">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">Masa Berlaku</label>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <FaCalendarAlt className="text-blue-600" />
                  <span>30 Januari 2026</span>
                </div>
              </div>
              <div className="sm:col-span-2 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <label className="text-[10px] uppercase font-black text-blue-600 block mb-1">Link System Andon Anda</label>
                <Link 
                  href={fullSubdomainLink} 
                  className="font-black text-blue-700 flex items-center gap-2 hover:underline break-all"
                >
                  <MdOutlineFactory className="shrink-0" />
                  {fullSubdomainLink}
                  <FaExternalLinkAlt size={12} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats atau Info Tambahan bisa ditaruh di sini */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 flex flex-col justify-between relative overflow-hidden">
            <MdOutlineFactory className="absolute -right-4 -bottom-4 text-white/10 text-[12rem]" />
            <div className="relative z-10">
              <h3 className="font-black text-xl mb-2 italic tracking-tighter">andonPro Professional</h3>
              <p className="text-blue-100 text-sm font-medium">Sistem Anda siap memantau lantai produksi hari ini.</p>
            </div>
            <Link href="/settings" className="relative z-10 mt-8 bg-white/10 backdrop-blur-md border border-white/20 text-center py-3 rounded-xl font-bold hover:bg-white/20 transition">
              Pengaturan Sistem
            </Link>
          </div>
        </div>

        {/* ACTIVE CALLS SECTION */}
        <div className="bg-white w-full shadow-xl shadow-slate-200/50 text-slate-800 rounded-3xl border border-slate-200 overflow-hidden mt-4">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <h2 className="font-black text-sm uppercase tracking-widest text-slate-900">
                Panggilan Aktif (Live)
              </h2>
            </div>
            <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500">
              Auto-refresh Aktif
            </span>
          </div>
          <div className="p-6">
            <ActiveCallList activeCalls={activeCalls.data}/>
          </div>
        </div>

      </MaxWidthWrapper>
    </div>
  );
};

export default DashboardPage;