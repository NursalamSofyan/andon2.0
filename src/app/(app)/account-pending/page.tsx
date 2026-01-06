// app/account-pending/page.tsx
import Link from "next/link";

export default function AccountPendingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="bg-white rounded-xl border-2 border-yellow-500 p-8 max-w-md shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="bg-yellow-100 rounded-full p-4 mb-4">
            <svg className="w-16 h-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Account Pending Approval
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your account is waiting for administrator approval. We'll notify you once your account is activated.
          </p>
          
          <Link 
            href="/"
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-all font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}