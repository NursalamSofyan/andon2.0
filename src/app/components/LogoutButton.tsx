"use client";

import { signOut } from "next-auth/react";
import { AiOutlineLogout } from "react-icons/ai";

export default function LogoutButton() {
  const handleLogout = async () => {
    // callbackUrl memastikan user diarahkan ke halaman login setelah logout
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-400 rounded-lg hover:bg-red-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mx-auto"
    >
      <AiOutlineLogout size={10} className="font-bold"/>
    </button>
  );
}