import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('user_role')?.value; 
  const { pathname } = request.nextUrl;
  
  const segments = pathname.split('/');
  const locale = segments[1] || 'kh';

  // ១. ការពារ Dashboard
  if (pathname.includes('/dashboard')) {
    if (!token || role !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
    }
  }

  // ២. បើមាន Token ហើយ មិនឱ្យចូលទំព័រ Login ទៀតទេ
  const isAuthPage = pathname.includes('/auth/customer-login') || pathname.includes('/auth/verify-otp');
  if (token && isAuthPage) {
    const target = role === 'ADMIN' ? `/${locale}/dashboard` : `/${locale}/home`;
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};