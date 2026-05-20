import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// القوائم التي حددناها للمسارات المختلفة
const publicRoutes = [
  '/', 
  '/about', 
  '/contact', 
  '/docs', 
  '/features', 
  '/how-it-works', 
  '/privacy', 
  '/problem', 
  '/solution', 
  '/terms', 
  '/use-cases'
];

const authRoutes = [
  '/signin', 
  '/signup', 
  '/forgot-password', 
  '/reset-password'
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // السماح بمسارات الـ API وملفات النظام والصور لضمان عدم حدوث بطء أو مشاكل
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // التحقق من وجود السيشن (الـ Refresh Token في الكوكيز) أو في رابط الصفحة (في حالة الـ OAuth)
  const hasRefreshToken = request.cookies.has('sopo_is_auth') || request.nextUrl.searchParams.has('refreshToken');

  // التحقق من نوع المسار الحالي
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/_internal');
  
  // التحقق إذا كان المسار يتبع أي من مسارات تسجيل الدخول
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // 1. إذا كان المستخدم مسجلاً ويحاول الدخول لصفحات تسجيل الدخول ➔ يتم توجيهه للوحة التحكم
  if (isAuthRoute && hasRefreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. إذا كان المستخدم غير مسجل ويحاول الدخول لصفحات محمية (ليست عامة وليست تسجيل دخول) ➔ يتم توجيهه للـ signin
  if (!hasRefreshToken && !isPublicRoute && !isAuthRoute) {
    // يمكننا حفظ المسار الأصلي للعودة إليه لاحقاً إذا احتجنا
    const signInUrl = new URL('/signin', request.url);
    // signInUrl.searchParams.set('callbackUrl', pathname); // اختياري في المستقبل
    return NextResponse.redirect(signInUrl);
  }

  // 3. السماح بمرور أي شيء آخر (مستخدم مسجل في صفحة محمية أو زائر في صفحة عامة)
  return NextResponse.next();
}

// تحديد متى يعمل الـ Middleware لتجنب التشغيل في المسارات غير الضرورية
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
