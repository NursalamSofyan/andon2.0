"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper"
import Link from "next/link"
import Image from "next/image"
import { FaSignInAlt, FaInfoCircle } from "react-icons/fa" // Menggunakan react-icons agar senada

export default function LoginClient() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !password) {
      setError("Harap isi semua kolom")
      setIsLoading(false)
      return
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Email atau password salah")
      setIsLoading(false)
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <MaxWidthWrapper className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full">
          {/* LOGO AREA */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-2 mb-2">
              <div className="bg-blue-600 rounded-lg">
                <Image
                  src="/images/logo_1.jpg" // Jika ini logo transparan akan lebih bagus
                  width={220}
                  height={100}
                  alt="andonPro"
                  className="rounded-sm"
                />
              </div>
            </Link>
            <p className="text-slate-500 font-medium text-sm">Masuk ke sistem manajemen Andon Anda</p>
          </div>

          {/* LOGIN CARD */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            <div className="p-8">
              <h1 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">
                Login
              </h1>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                  <FaInfoCircle className="shrink-0" />
                  <span className="text-sm font-bold">{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email :</label>
                  <input
                    type="email"
                    placeholder="nama@perusahaan.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    disabled={isLoading}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Password :</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    disabled={isLoading}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all disabled:opacity-50"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 transition"
                  >
                    Lupa password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white p-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk</span>
                      <FaSignInAlt />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
              <p className="text-sm text-slate-500 font-medium">
                Belum punya akun?{" "}
                <Link href="/signup" className="text-blue-600 font-black hover:underline">
                  Daftar di sini
                </Link>
              </p>
            </div>
          </form>

          {/* FOOTER INFO */}
          <p className="mt-8 text-center text-slate-400 text-xs font-medium">
            &copy; 2024 andonPro Automation. Secure Industrial Connection.
          </p>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}