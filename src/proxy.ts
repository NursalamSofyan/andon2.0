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
    if (parts.length > 6) {
      return parts[0];
    }
    return null;
  }

  // 2. Local development (localhost) - FIXED
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    const parts = hostname.split('.');
    // Format: subdomain.localhost atau subdomain.127.0.0.1
    if (parts.length >= 2) {
      const lastPart = parts[parts.length - 1];
      // Cek apakah last part adalah localhost atau IP segment terakhir
      if (lastPart === 'localhost' || /^\d{1,3}$/.test(lastPart)) {
        // Return semua parts kecuali yang terakhir (localhost/IP)
        const subdomain = parts.slice(0, -1).join('.');
        return subdomain || null;
      }
    }
    return null;
  }

  // 3. Handle Vercel deployment URLs
  if (hostname.endsWith('.vercel.app')) {
    // Format preview: tenant---branch-name.vercel.app
    if (hostname.includes('---')) {
      return hostname.split('---')[0];
    }
    // Format subdomain biasa: subdomain.project.vercel.app
    const parts = hostname.split('.');
    if (parts.length > 3) {
      // subdomain.andonpro.vercel.app -> return 'subdomain'
      return parts[0];
    }
    // andonpro.vercel.app (no subdomain)
    return null;
  }

  // 4. Production environment
  const rootDomainFormatted = rootDomain.split(':')[0];
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // Debug log - hapus setelah testing berhasil
  console.log('🔍 Proxy Debug:', {
    host: request.headers.get('host'),
    pathname,
    subdomain,
  });

  // Handle IP murni tanpa nip.io
  const host = request.headers.get('host') || '';
  const ipMatch = host.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$/);
  
  if (ipMatch) {
    const ip = ipMatch[1];
    const port = ipMatch[2] || '';
    return NextResponse.redirect(
      new URL(`${request.nextUrl.protocol}//${ip}.nip.io${port}${pathname}`)
    );
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const publicRoutes = ['/scan', '/call', '/login', '/register', '/forgot-password', '/verify-email', '/unauthorized', '/account-inactive'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // --- Subdomain Logic ---
  if (subdomain) {
    console.log('✅ Subdomain detected:', subdomain);

    // Allow public routes without token
    if (isPublicRoute) {
      console.log('📂 Rewriting public route to:', `/${subdomain}${pathname}`);
      return NextResponse.rewrite(new URL(`/${subdomain}${pathname}`, request.url));
    }

    // Redirect to login if no token
    if (!token) {
      console.log('🔒 No token, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate token domain
    if (token.domain && token.domain !== subdomain) {
      console.log('❌ Domain mismatch:', token.domain, 'vs', subdomain);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Check account status
    if (token.status !== 'active' && !isAuthRoute && pathname !== '/account-inactive') {
      console.log('⚠️ Account inactive, redirecting');
      return NextResponse.redirect(new URL('/account-inactive', request.url));
    }

    // Redirect from auth routes if already logged in
    if (isAuthRoute) {
      console.log('➡️ Already logged in, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Rewrite to subdomain route
    console.log('🔄 Rewriting to:', `/${subdomain}${pathname}`);
    return NextResponse.rewrite(new URL(`/${subdomain}${pathname}`, request.url));
  }

  // --- Root Domain Logic ---
  console.log('🏠 Root domain request');

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
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - files with extensions (images, css, js, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ]
};

export { extractSubdomain };