"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { deleteToken, getToken } from "@/lib/auth";
import { MeContext, useFetchMe } from "@/hooks/Useme";
import { canAccess, homeFor } from "@/lib/roles";
import { Button } from "@/components/ui/button";

function Spinner() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <div className="inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-orange-500 border-t-transparent" />
    </div>
  );
}

/**
 * Wrap a layout with this. It:
 *  1. sends logged-out visitors to /login (and back afterwards via ?next=)
 *  2. loads /auth/me once and shares it with every useMe() below
 *  3. sends users who open a page their role can't use to their own home
 */
export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [tokenState, setTokenState] = useState<"pending" | "yes" | "no">("pending");

  useEffect(() => {
    setTokenState(getToken() ? "yes" : "no");
  }, []);

  const state = useFetchMe(tokenState === "yes");
  const { me, error } = state;

  useEffect(() => {
    if (tokenState === "no") {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [tokenState, pathname, router]);

  useEffect(() => {
    if (me && !canAccess(me.role, pathname)) {
      router.replace(homeFor(me.role));
    }
  }, [me, pathname, router]);

  // /auth/me failed for a reason other than an expired login (a 401 is
  // handled in apiRequest, which logs out and redirects)
  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-100 p-4 dark:bg-zinc-900">
        <div className="max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-base font-semibold">Can&apos;t reach your account</h2>
          <p className="mt-1 text-sm text-zinc-500">{error}</p>
          <div className="mt-5 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => state.refetch()}>
              Try again
            </Button>
            <Button
              className="flex-1 bg-black text-white hover:bg-orange-500 dark:bg-white dark:text-black"
              onClick={() => {
                deleteToken();
                router.replace("/login");
              }}
            >
              Log in again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!me || !canAccess(me.role, pathname)) return <Spinner />;

  return <MeContext.Provider value={state}>{children}</MeContext.Provider>;
}