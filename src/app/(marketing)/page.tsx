import MaxWidthWrapper from "../components/MaxWidthWrapper";

export default function Home() {
  return (
    <MaxWidthWrapper className="flex flex-col justify-center text-center">
    <section className="bg-slate-900 text-white px-6 py-20">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          <span className="text-blue-500">/and</span><span className="text-green-500">onPro</span>: Digitalize Your Shop Floor
        </h1>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
         Terapkan System Andon dengan Mudah dan Murah, 
         tanpa kerumitan setting button call dan jaringan.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full font-bold transition-all">
            Coba Sekarang (Free)
          </button>
          <button className="border border-slate-700 hover:bg-slate-800 px-8 py-4 rounded-full font-bold transition-all">
            Konsultasi Gratis
          </button>
        </div>
        
        {/* Mockup Dashboard Preview */}
        <div className="mt-16 border-8 border-slate-800 rounded-xl overflow-hidden shadow-2xl">
           <div className="bg-slate-800 p-2 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
           </div>
           <div className="bg-slate-100 h-64 flex items-center justify-center text-slate-400 italic">
             [ Gambar Screenshot Dashboard Andon Pro Anda ]
           </div>
        </div>
      </div>
    </section>
    </MaxWidthWrapper>
  );
}
