import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/auth";

// 1. Specify protected and public routes
const publicRoutes = ["/", "/auth/login", "/auth/register", "/pricing"];
const protectedRoutes = ["/dashboard", "/onboarding", "/projects/create", "/projects/bid"];

export async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const session = await getSession();

  // 4. Redirect to /auth/login if the user is not authenticated
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated and trying to access auth pages
  if (isPublicRoute && session && path.startsWith("/auth")) {
    // Redirect based on role
    if (session.role === "MAHASISWA") {
      return NextResponse.redirect(new URL("/dashboard/mahasiswa", req.nextUrl));
    } else if (session.role === "MITRA") {
      return NextResponse.redirect(new URL("/dashboard/mitra", req.nextUrl));
    } else if (session.role === "SUPERUSER") {
      return NextResponse.redirect(new URL("/dashboard/superuser", req.nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
