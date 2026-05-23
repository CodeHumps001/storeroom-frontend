import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Read the token from cookies (key: "token")
  const token = request.cookies.get("token")?.value;
  // 2. Get the pathname from request.nextUrl
  const pathname = request.nextUrl.pathname;
  // 3. If no token and pathname starts with /dashboard, /products etc → redirect to /login
  const protectedRoutes = [
    "/products",
    "/categories",
    "/sales",
    "/reports",
    "/staff",
    "/settings",
  ];

  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // 4. If token exists and pathname is /login → redirect to /dashboard
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // 5. Otherwise → allow through with NextResponse.next()
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/products/:path*",
    "/categories/:path*",
    "/sales/:path*",
    "/reports/:path*",
    "/staff/:path*",
    "/settings/:path*",
  ], // which routes does middleware run on?
};
