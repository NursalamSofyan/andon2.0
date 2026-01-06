import MaxWidthWrapper from './MaxWidthWrapper'
import Link from 'next/link'
import Image from 'next/image';
import LogoutButton from './LogoutButton';

const Navbar = ({ user }: { user: any }) => {
  return (
    <nav className='sticky h-16 inset-x-0 top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Link href="/" className="flex z-40 font-extrabold text-2xl text-primary italic font-sans tracking-tight">
              <span className="text-foreground">Andon</span><span className="text-primary">Pro</span>
            </Link>
          </div>

          {/* todo: add mobile nav function*/}
          <div className='hidden items-center space-x-6 sm:flex'>
            <Link href="/" className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'>Dashboard</Link>
            <Link href="/" className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'>Pricing</Link>
            <div className="flex items-center gap-4 pl-4 border-l border-border">
              <span className="text-sm font-medium text-foreground">Halo, {user?.name}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar