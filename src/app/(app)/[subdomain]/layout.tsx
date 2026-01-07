import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// app/(app)/[subdomain]/layout.tsx
export default async function SubdomainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);  
  return (
    <div className="subdomain-wrapper bg-slate-950">
      <main className="bg-slate-950">
        {children}
      </main>
    </div>
  );
}