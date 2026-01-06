import NavbarSub from "@/app/components/NavbarSub";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// app/(app)/[subdomain]/layout.tsx
export default async function ViewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="subdomain-wrapper">
      <main>
        {children}</main>
    </div>
  );
}