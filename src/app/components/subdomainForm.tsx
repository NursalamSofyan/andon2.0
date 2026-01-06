// components/SubdomainForm.tsx
"use client";
import { saveUserSubdomain } from "@/lib/subdomain";

export default function SubdomainForm({ currentDomain }: { currentDomain?: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border">
      <h2 className="text-xl font-bold mb-4">Setting Subdomain</h2>
      <form action={async (formData) => {
        const res = await saveUserSubdomain(formData);
        if (res.error) alert(res.error);
        else alert("Subdomain berhasil diset!");
      }}>
        <div className="flex items-center gap-2 border p-2 rounded-lg">
          <input 
            name="domain" 
            defaultValue={currentDomain}
            placeholder="nama-subdomain" 
            className="outline-none w-full"
          />
          <span className="text-gray-400">.yourdomain.com</span>
        </div>
        <button className="mt-4 w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition">
          {currentDomain ? "Update Subdomain" : "Buat Subdomain Sekarang"}
        </button>
      </form>
    </div>
  );
}