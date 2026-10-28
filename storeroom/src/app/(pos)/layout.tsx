"use client";

import AuthGuard from "@/components/auth/AuthGuard";

export default function PosLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="h-screen w-screen overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {children}
      </div>
    </AuthGuard>
  );
}