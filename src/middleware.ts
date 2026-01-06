import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { rootDomain } from '@/lib/utils';

function extractSubdomain(request: NextRequest): string | null {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0]; // Menghilangkan port jika ada

  // 1. Logika untuk nip.io (Local Development via IP)
  if (hostname.includes('.nip.io')) {
    const parts = hostname.split('.');
    // Format: [subdomain].[ip].[ip].[ip].[ip].nip.io
    // Jika ada subdomain, parts.length akan lebih dari 6
    if (parts.length > 6) {
      return parts[0];
    }
    return null;
  }

  // 2. Local development (localhost)
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[parts.length - 1] === 'localhost') {
      return parts[0];
    }
    return null;
  }

  // 3. Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    return hostname.split('---')[0];
  }

  // 4. Production environment
  const rootDomainFormatted = rootDomain.split(':')[0];
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // Jika URL mengandung IP murni tanpa nip.io (seperti gambar sebelumnya), 
  // kita bisa arahkan otomatis ke nip.io agar sistem subdomain bekerja
  const host = request.headers.get('host') || '';
  const ipMatch = host.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$/);
  
  if (ipMatch) {
    const ip = ipMatch[1];
    const port = ipMatch[2] || '';
    // Redirect ke format nip.io agar subdomain bisa dideteksi nantinya
    return NextResponse.redirect(new URL(`${request.nextUrl.protocol}//${ip}.nip.io${port}${pathname}`));
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const publicRoutes = ['/scan', '/call', '/login', '/register', '/forgot-password', '/verify-email', '/unauthorized'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (subdomain) {
    // Rewrite untuk multi-tenancy (mengambil folder app/[subdomain]/...)
    if (isPublicRoute) {
      return NextResponse.rewrite(new URL(`/${subdomain}${pathname}`, request.url));
    }

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token && token.domain && token.domain !== subdomain) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (token.status !== 'active' && !isAuthRoute) {
      return NextResponse.redirect(new URL('/account-inactive', request.url));
    }

    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.rewrite(new URL(`/${subdomain}${pathname}`, request.url));
  }

  // --- Root Domain Logic ---
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const protectedRootRoutes = ['/admin', '/dashboard', '/settings'];
  const isProtectedRoute = protectedRootRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|[\\w-]+\\.\\w+).*)'
  ]
};