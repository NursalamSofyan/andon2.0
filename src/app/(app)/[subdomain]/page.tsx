import { getSubdomainData } from "@/lib/subdomain";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

interface SubdomainPageProps {
  params: { subdomain: string };
}

export default async function SubdomainHomePage({ params }: SubdomainPageProps) {
  const { subdomain } = await params;
  // Ambil data user/subdomain dari database
  const data = await getSubdomainData(subdomain)
    if (!data) {
      notFound();
    }

  const session = await getServerSession(authOptions);  
   if (!session || !session.user) {
      redirect("/login?callbackUrl=/dashboard");
    }  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-8xl mb-4">{data.image || "🌐"}</div>
      <h1 className="text-4xl font-bold">{data.name}</h1>
      <p className="text-gray-500 mt-2">Welcome to my personal subdomain!</p>
      
      <div className="mt-8 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
        Status: <strong>{data.status || "Active"}</strong>
      </div>
    </div>
  );
}