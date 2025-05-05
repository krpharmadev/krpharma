import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isLineLiff = (req: NextRequest): boolean => {
  const userAgent = req.headers.get('user-agent') || '';
  return userAgent.includes('Line') || req.nextUrl.pathname.startsWith('/liff');
};

export default auth((req: NextRequest & { auth: any }) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isAuthPage = nextUrl.pathname.startsWith('/auth');
  const isLiff = isLineLiff(req);

  // แยกเส้นทางตาม platform
  if (isLiff) {
    if (!nextUrl.pathname.startsWith('/liff')) {
      return NextResponse.redirect(new URL(`/liff${nextUrl.pathname}`, nextUrl));
    }
    
    // ถ้าเป็น LIFF path ให้ปล่อยให้ LIFF SDK จัดการการ login เอง
    // โดยไม่ทำ redirect ไปที่หน้า signin
    return NextResponse.next();
  } else {
    if (nextUrl.pathname.startsWith('/liff')) {
      return NextResponse.redirect(new URL(nextUrl.pathname.replace('/liff', ''), nextUrl));
    }
  }

  // ถ้าผู้ใช้ยังไม่ได้เข้าสู่ระบบและพยายามจะเข้าถึงหน้าที่ต้องล็อกอิน (เฉพาะ non-LIFF)
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/signin', nextUrl));
  }

  // ถ้าผู้ใช้เข้าสู่ระบบแล้วและพยายามจะเข้าถึงหน้า login หรือ register
  if (isLoggedIn && isAuthPage) {
    const redirectUrl = isLiff ? '/liff/dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, nextUrl));
  }

  return NextResponse.next();
});

// กำหนดเส้นทางที่จะบังคับใช้ middleware นี้
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 