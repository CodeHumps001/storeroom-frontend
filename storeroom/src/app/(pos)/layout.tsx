"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/Useme";

export default function PosLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { me, loading } = useMe();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
  }, [mounted]);

  useEffect(() => {
    if (!me || loading) return;
    if (me.role === "CASHIER") {
      router.push("/pos");
    }
  }, [me]);

  if (!mounted || loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
        <div className="inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!mounted) return null;

  const token = getToken();
  if (!token) return null;

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      {children}
    </div>
  );
}
