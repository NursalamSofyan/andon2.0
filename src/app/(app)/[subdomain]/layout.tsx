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
    <div className="subdomain-wrapper">
      <main className="bg-gray-50">
        {children}
      </main>
    </div>
  );
}