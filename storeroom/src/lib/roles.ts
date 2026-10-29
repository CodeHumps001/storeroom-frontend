/**
 * Single place that decides where each role lands and what it may open.
 * Edit this file when you add pages or change who can see what.
 */
export type Role = "OWNER" | "CASHIER";

export const isRole = (r: unknown): r is Role =>
  r === "OWNER" || r === "CASHIER";

/** Where each role goes after login / when sent "home". */
export const HOME: Record<Role, string> = {
  OWNER: "/dashboard",
  CASHIER: "/pos",
};

/** Cashiers may ONLY open these. Owners may open everything. */
export const CASHIER_ROUTES = ["/pos", "/scan"];

/** Pages that require a login (used by middleware). Add new top-level pages here. */
export const PROTECTED_PREFIXES = [
  "/dashboard",
  "/products",
  "/categories",
  "/sales",
  "/reports",
  "/staff",
  "/settings",
  "/credits",
  "/coupons",
  "/pos",
  "/scan",
];

/** Pages a logged-in user should be bounced away from. */
export const AUTH_PAGES = ["/login", "/register"];

export const matchesPrefix = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));

export const homeFor = (role: unknown) => (isRole(role) ? HOME[role] : "/dashboard");

export const canAccess = (role: unknown, pathname: string) => {
  if (role === "OWNER") return true;
  if (role === "CASHIER") return matchesPrefix(pathname, CASHIER_ROUTES);
  return false;
};

/**
 * Where to send someone right after they log in. Honors ?next= (e.g. the
 * pairing link /scan?c=abc) but only for local paths the role may open.
 */
export function postLoginPath(role: unknown, next?: string | null) {
  if (
    next &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    canAccess(role, next.split("?")[0])
  ) {
    return next;
  }
  return homeFor(role);
}

/** Reads the role from a JWT on the client (right after login), no extra request needed. */
export function roleFromToken(token: string): Role | null {
  try {
    const part = token.split(".")[1];
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    const role = JSON.parse(json).role;
    return isRole(role) ? role : null;
  } catch {
    return null;
  }
}