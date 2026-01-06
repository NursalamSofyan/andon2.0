// app/account-suspended/page.tsx
import Link from "next/link";
import { signOut } from "next-auth/react";
import LogoutButton from "@/app/components/LogoutButton";

export default function AccountSuspendedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="bg-white rounded-xl border-2 border-red-500 p-8 max-w-md shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <svg 
              className="w-16 h-16 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Account Suspended
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your account has been suspended. Please contact the administrator for more information.
          </p>
          
          <div className="flex gap-4 w-full">
            <LogoutButton />

            
            <Link 
              href="/contact"
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}