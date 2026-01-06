import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSubdomainLink } from "@/lib/subdomain";
import { validateUserStatus } from "@/lib/auth-helpers";
import { getAllActiveCalls } from "@/app/actions/call-actions";
import ActiveCallList from "@/app/components/activeCalls";

const DashboardPage = async () => {
const { session, user } = await validateUserStatus();

if (!session || !session.user) {
  redirect("/login?callbackUrl=/dashboard");
}  

if (!user?.domain) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-rose-300 rounded-xl border-b border-rose-500 p-8 flex flex-col items-center justify-center shadow-xl">
          <p className="text-zinc-800 font-medium text-center">
            You haven't registered any andonPro Sub Domain, <br />
            Create one here !!
          </p>
          <Link 
            href="/createsubdomain" 
            className="bg-red-700 px-6 py-2 rounded-lg mt-8 border-2 border-red-300 text-white hover:bg-red-800 transition-all"
          >
            Create new Sub Domain
          </Link>
        </div>
      </div>
    );
  }

const fullSubdomainLink = await getSubdomainLink(user.domain);

const activeCalls = await getAllActiveCalls()

return (
    <MaxWidthWrapper className="flex flex-col gap-4">
      {/* user Informations */}
      <div className="bg-sky-100 w-full shadow-lg text-zinc-800 rounded-xl border-b-2 border-blue-300">
        <h2 className="font-semibold py-2 bg-sky-600 text-white p-4 rounded-t-lg shadow-sm">
        USER INFORMATIONS
        </h2>
        <div className="grid grid-cols-4 gap-2 p-4">
          <div className="border-b border-zinc-700/50 col-span-2">User Name / email</div>
          <div className="border-b border-zinc-700/50 col-span-2">{user.name} / {user.email}</div>
          <div className="border-b border-zinc-700/50 col-span-2">Link System Andon</div>
          <Link href={fullSubdomainLink} className="border-b border-zinc-700/50 col-span-2">{fullSubdomainLink}</Link>
          <div className="border-b border-zinc-700/50 col-span-2">Account Status</div>
          <div className="border-b border-zinc-700/50 col-span-2">{user.status || "Pending"}</div>
          <div className="border-b border-zinc-700/50 col-span-2">Expired</div>
          <div className="border-b border-zinc-700/50 col-span-2">30 Januari 2026</div>
        </div>
      </div>

      <div className="bg-sky-100 w-full shadow-lg text-zinc-800 rounded-xl border-b-2 border-blue-300">
        <h2 className="font-semibold py-2 bg-lime-600 text-white p-4 rounded-t-lg shadow-sm">
        ACTIVE CALLS
        </h2>
        <div className="p-4">
          <ActiveCallList activeCalls={activeCalls.data}/>
        </div>
      </div>


      <div className="flex items-center justify-center h-100 bg-green-500 mt-20 rounded-xl shadow-lg text-white text-sm font-semibold">
      </div>
    </MaxWidthWrapper>
  )
}

export default DashboardPage