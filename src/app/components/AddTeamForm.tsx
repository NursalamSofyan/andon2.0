"use client";

import { useState } from "react";
import { addTeamMember } from "@/app/actions/team-actions";
import { useRouter } from "next/navigation";
import { FaUserPlus } from "react-icons/fa";

import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

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
      setMessage("✅ Member added successfully!");
      (e.target as HTMLFormElement).reset();
      router.refresh(); // Memperbarui list data di server component
    } else {
      setMessage(`❌ ${result.error}`);
    }
    setLoading(false);
  }

  return (
    <div className="px-6 py-6 bg-card rounded-lg border border-border mt-4 shadow-sm">
      <h3 className="font-semibold text-lg text-primary mb-6 flex items-center gap-2">
        <FaUserPlus className="text-primary" />
        Add New Team Member
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Input name="name" placeholder="Full Name" required />
        <Input name="email" type="email" placeholder="Email Address" required />
        <Input name="password" type="password" placeholder="Password" required />
        <div className="relative">
          <select
            name="andonRole"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="MEKANIK">MEKANIK</option>
            <option value="QUALITY">QUALITY</option>
            <option value="MATERIAL">MATERIAL</option>
          </select>
        </div>
        <Button
          disabled={loading}
          className="w-full font-bold"
        >
          {loading ? "Adding..." : "Add Member"}
        </Button>
      </form>
      {message && (
        <p className={`text-sm font-medium mt-4 p-2 rounded-md ${message.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </p>
      )}
    </div>
  );
}