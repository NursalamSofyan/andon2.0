"use client"

import { useState } from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
// Import react-icons untuk keselarasan dengan landing & dashboard
import { FaBars, FaTimes } from 'react-icons/fa'
import { MdDashboard, MdAttachMoney, MdOutlineFactory } from 'react-icons/md'

const Navbar = ({ user }: { user: any }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className='sticky h-16 inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-16 items-center justify-between'>
          {/* LOGO SECTION */}
          <div className='flex items-center gap-2'>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                <MdOutlineFactory className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tighter italic text-slate-900">
                andonPro
              </span>
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <div className='hidden items-center space-x-8 md:flex'>
            <Link 
              href="/dashboard" 
              className='flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors'
            >
              <MdDashboard className="text-lg" /> Dashboard
            </Link>

            
            <div className="flex items-center gap-6 pl-6 border-l border-slate-200">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900 leading-none">{user?.name}</span>
              </div>
              <LogoutButton />
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className='md:hidden flex items-center gap-4'>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV DROPDOWN */}
        {isOpen && (
          <div className='md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300'>
            <Link 
              href="/dashboard" 
              onClick={() => setIsOpen(false)}
              className='flex items-center gap-4 text-lg font-black text-slate-700'
            >
              <div className="bg-slate-100 p-2 rounded-lg">
                <MdDashboard className="text-blue-600" />
              </div>
              Dashboard
            </Link>
            <Link 
              href="/#pricing" 
              onClick={() => setIsOpen(false)}
              className='flex items-center gap-4 text-lg font-black text-slate-700'
            >
              <div className="bg-slate-100 p-2 rounded-lg">
                <MdAttachMoney className="text-blue-600" />
              </div>
              Pricing
            </Link>
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase">Logged in as</span>
                <span className="text-sm font-bold text-slate-900">{user?.name}</span>
              </div>
              <LogoutButton />
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar