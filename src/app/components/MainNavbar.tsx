"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
// Import dari react-icons
import { FaBars, FaTimes, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard, MdSettings, MdOutlineFactory, MdOutlineFeaturedPlayList } from "react-icons/md";

export default function MainNavbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Mapping Link berdasarkan status login
  const navLinks = session
    ? [
        { name: "Dashboard", href: "/dashboard", icon: MdDashboard },
        { name: "Settings", href: "/settings", icon: MdSettings },
      ]
    : [
        { name: "Login", href: "/login", icon: FaSignInAlt }
    ];

  return (
    <nav className="fixed w-full z-100 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
            <MdOutlineFactory className="text-white text-lg" />
          </div>
          <span className="text-xl font-black tracking-tighter italic">andonPro</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition"
            >
              <link.icon className="text-lg" />
              {link.name}
            </Link>
          ))}
          
          {session && (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 transition border-l pl-6 border-slate-200"
            >
              <FaSignOutAlt /> Keluar
            </button>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button 
          className="md:hidden p-2 text-slate-600 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-2xl">
          <div className="flex flex-col p-6 gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 text-lg font-black text-slate-700"
              >
                <div className="bg-slate-100 p-2 rounded-md">
                  <link.icon className="text-blue-600" />
                </div>
                {link.name}
              </Link>
            ))}
            
            {session && (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-4 text-lg font-black text-red-500 pt-4 border-t border-slate-100"
              >
                <div className="bg-red-50 p-2 rounded-md">
                  <FaSignOutAlt />
                </div>
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}