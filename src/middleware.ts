import { errors, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { protectedRoutes, publicRoutes } from 'lib/constants';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
  const isHomePage = path === '/'
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');

  if(token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-secret-key'
      );
      const { payload } = await jwtVerify(token.value, secret);
      const isAuthenticated = payload?.userId;

      // Redirect authenticated users from home page to dashboard
      if (isHomePage && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
      }

      if (isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
      }
      return NextResponse.next();
    }
    catch(error) {
      if(error instanceof errors.JWTExpired) {
        cookieStore.delete('auth-token');
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  //no token, only allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }
  if (isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};