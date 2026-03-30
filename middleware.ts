import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ១. ចាប់យក Token និង Role ពី Cookies (ដែលហៅចេញពី Backend API)
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('user_role')?.value; 
  const { pathname } = request.nextUrl;
  
  // ២. កំណត់ Locale (Default: kh)
  const segments = pathname.split('/');
  const locale = segments[1] || 'kh';

  // --- លក្ខខណ្ឌទី ១: ការពារផ្លូវ ADMIN (Dashboard) ---
  if (pathname.includes('/dashboard')) {
    // បើគ្មាន Token ឬ Role មិនមែនជា ADMIN ត្រូវរុញទៅ Login វិញ
    if (!token || role !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${locale}/auth/customer-login`, request.url));
    }
  }

  // --- លក្ខខណ្ឌទី ២: ការពារផ្លូវ USER (Home) ---
  if (pathname.includes('/home')) {
    // 💡 ចំណុចសំខាន់៖ បើគាត់ជា ADMIN តែមកចូលទំព័រ USER (Home) ត្រូវរុញគាត់ទៅ Dashboard វិញ
    if (token && role === 'ADMIN') {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
    // បើគ្មាន Token សោះ រុញទៅ Login
    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}/auth/customer-login`, request.url));
    }
  }

  // --- លក្ខខណ្ឌទី ៣: បើ Login រួចហើយ មិនឱ្យចូលទំព័រ Login/Verify ស្ទួនទេ ---
  const isAuthPage = pathname.includes('/auth/customer-login') || 
                     pathname.includes('/auth/customer-verify-otp');

  if (token && isAuthPage) {
    // បើមាន Token ហើយ ត្រូវឆែក Role ដើម្បីរុញទៅទំព័រដែលត្រូវ
    const targetPath = role === 'ADMIN' ? `/${locale}/dashboard` : `/${locale}/home`;
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  return NextResponse.next();
}

// កំណត់ Matcher ដើម្បីឱ្យ Middleware ដើរលើគ្រប់ទំព័រ លើកលែងតែ API និង Static Files
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};