import MaxWidthWrapper from './MaxWidthWrapper'
import Link from 'next/link'
import Image from 'next/image';
import LogoutButton from './LogoutButton';
import { getSubdomainLink } from '@/lib/subdomain';



const NavbarSub = async ({ user }: { user: any }) => {
  const fullSubdomainLink = await getSubdomainLink(user?.domain);
  return (
    <nav className='sticky h-16 inset-x-0 top-0 z-30 bg-white/75 backdrop-blur-xl transition-all'>
        <MaxWidthWrapper>
            <div className='flex h-14 items-center justify-between border-zinc-200 shadow-sm'>
              <div className='flex items-center gap-2 mt-'>
                <Link href="/" className="flex z-40 font-extrabold text-3xl text-blue-400 italic font-sans">
                <Image src="/images/logo_1.jpg" width={150} height={400} alt='logo'/>
                </Link>
                <p>{fullSubdomainLink}</p>
              </div>

            {/* todo: add mobile nav function*/}
            <div className='hidden items-end space-x-2 sm:flex text-zinc-700 justify-between'>
                <Link href="/" className='px-4 py-2 border-b-2 hover:border-blue-500 border-blue-300 font-bold rounded-sm shadow-sm'>Dashboard</Link>
                <Link href="/" className='px-4 py-2 border-b-2 hover:border-blue-500 border-blue-300 rounded-sm shadow-sm text-zinc-500'>Pricing</Link>
                <div>
                <span className="text-sm text-gray-600">Halo, {user?.name}</span>
                <LogoutButton />
                </div>
            </div>
            </div>
        </MaxWidthWrapper>
    </nav>
  )
}

export default NavbarSub