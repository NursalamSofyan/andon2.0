"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validasi client-side
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        // Parse error message dari server
        if (res.error.includes("Account is not active")) {
          setError("Your account is not active. Please contact administrator.");
        } else if (res.error.includes("CredentialsSignin")) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(res.error);
        }
        setIsLoading(false);
      } else if (res?.ok) {
        // Login berhasil
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <MaxWidthWrapper className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col mx-auto bg-linear-to-b from-blue-500 via-blue-500 to-green-500 rounded-lg border shadow-xl border-green-500  overflow-hidden text-gray-50 max-w-md w-full"
      >
        <h1 className="text-2xl font-bold w-full bg-blue-900/40 px-4 py-2">
          Login
        </h1>
        <Link href="/">
          <Image
            src="/images/logo_1.jpg"
            width={300}
            height={100}
            alt="scan qr code andonPro"
            className=" md:h-40 bg-white w-full object-contain"
          />
        </Link>

        <div className="flex flex-col p-4 text-gray-800">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start">
              <svg
                className="w-5 h-5 mr-2 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <label className="font-medium mb-1">Email :</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(""); // Clear error saat user mulai mengetik
            }}
            disabled={isLoading}
            className="border rounded-full px-4 py-2 bg-white mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />

          <label className="font-medium mb-1">Password :</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(""); // Clear error saat user mulai mengetik
            }}
            disabled={isLoading}
            className="border rounded-full px-4 py-2 bg-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-700 text-white p-2 rounded-full cursor-pointer hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Forgot Password Link */}
          <Link
            href="/forgot-password"
            className="text-center text-sm mt-3 hover:underline cursor-pointer text-blue-100"
          >
            Forgot password?
          </Link>
        </div>

        <Link
          href="/signup"
          className="text-center text-sm py-2 hover:underline cursor-pointer border-t border-blue-400/30"
        >
          Don't have an account yet? Sign up here
        </Link>
      </form>
    </MaxWidthWrapper>
  );
}