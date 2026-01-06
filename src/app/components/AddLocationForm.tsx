"use client";

import { useState } from "react";
import { addLocation } from "@/app/actions/location-actions";
import { MdAddHome } from "react-icons/md";

export default function AddLocationForm({ adminId }: { adminId: string }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    const result = await addLocation({ name, adminId });
    
    if (result.success) {
      setName("");
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-green-50/50 border-b border-green-200">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama Lokasi (Contoh: Line A / Cell 01)"
        className="flex-1 p-2 text-sm rounded-lg border border-green-300 outline-none focus:ring-2 focus:ring-green-500 bg-white"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all disabled:bg-zinc-400 px-3 hover:scale-110"
        title="Add Locations"
      >
        {loading ? "..." : <MdAddHome size={14} />}
      </button>
    </form>
  );
}