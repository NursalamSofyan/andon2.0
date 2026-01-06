"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(form)
    });

    if (res.ok) router.push("/login");
    else alert("Gagal mendaftar");
  };

  return (
    <MaxWidthWrapper className="flex items-center justify-center min-h-screen">
    <form onSubmit={handleSignup} className="flex flex-col mx-auto bg-linear-to-b from-blue-500 via-blue-500 to-green-500  rounded-lg border shadow-xl  border-green-500 min-w-lg overflow-hidden text-gray-700 max-w-md">
      <h1 className="text-2xl font-bold w-full bg-blue-900/70 px-4 py-2">Sign Up</h1>
      <Image src="/images/logo_1.jpg" width={300} height={100} alt="scan qr code andonPro" className="h-40 bg-white w-full object-contain"/>
      <div className="flex flex-col p-2 gap-2 my-8">
      <input type="text" placeholder="Nama" onChange={(e) => setForm({...form, name: e.target.value})} className="border rounded-full px-4 py-2 bg-white"/>
      <input type="email" placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} className="border rounded-full px-4 py-2 bg-white"/>
      <input type="password" placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} className="border rounded-full px-4 py-2 bg-white"/>
      <button type="submit" className="bg-blue-700 text-white p-2 mt-2 rounded-full cursor-pointer">Daftar</button>
      </div>
      <Link href="/login" className="text-center text-sm py-1 hover:underline cursor-pointer">Already have account? Login here</Link>

    </form>
    </MaxWidthWrapper>

    
  );
}