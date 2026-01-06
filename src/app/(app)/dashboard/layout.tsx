import Navbar from "@/app/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// app/(app)/[subdomain]/layout.tsx
export default async function mainDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);  
  return (
    <div className="subdomain-wrapper">
      <main>
        <Navbar user={session?.user}/>
        {children}
      </main>
    </div>
  );
}