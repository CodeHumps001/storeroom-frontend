import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_PAGES,
  PROTECTED_PREFIXES,
  canAccess,
  homeFor,
  isRole,
  matchesPrefix,
} from "@/lib/roles";

/** Reads the JWT payload (NOT verified; the backend verifies on every API call).
 *  Only used to route people quickly; real protection stays on the server. */
function readPayload(token: string): { role?: string; exp?: number } | null {
  try {
    const part = token.split(".")[1];
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const payload = token ? readPayload(token) : null;
  const expired = !!payload?.exp && payload.exp * 1000 < Date.now();
  const loggedIn = !!token && !expired;
  const role = payload?.role; // undefined if your JWT has no role: client guard handles it

  const clearIfExpired = (res: NextResponse) => {
    if (expired) res.cookies.delete("token");
    return res;
  };

  // Login/register pages: send logged-in users to their own home
  if (matchesPrefix(pathname, AUTH_PAGES)) {
    if (loggedIn) {
      return NextResponse.redirect(new URL(homeFor(role), request.url));
    }
    return clearIfExpired(NextResponse.next());
  }

  // Protected pages
  if (matchesPrefix(pathname, PROTECTED_PREFIXES)) {
    if (!loggedIn) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname + search);
      return clearIfExpired(NextResponse.redirect(url));
    }
    if (isRole(role) && !canAccess(role, pathname)) {
      return NextResponse.redirect(new URL(homeFor(role), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/products/:path*",
    "/categories/:path*",
    "/sales/:path*",
    "/reports/:path*",
    "/staff/:path*",
    "/settings/:path*",
    "/credits/:path*",
    "/pos/:path*",
    "/scan/:path*",
  ],
};