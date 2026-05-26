"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import Sidebar from "@/components/shared/sidebar";
import { useMe } from "@/hooks/Useme";
import WhatsAppSupport from "@/components/shared/WhatsAppSupport";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/categories": "Categories",
  "/sales": "Sales",
  "/reports": "Reports",
  "/staff": "Staff",
  "/settings": "Settings",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { me } = useMe();

  // Hydration fix — only run client-side
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const token = getToken();
    if (!token) router.push("/login");
  }, [mounted]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Don't render until client hydration is complete
  if (!mounted) return null;

  const token = getToken();
  if (!token) return null;

  const pageTitle = pageTitles[pathname] ?? "Storeroom";

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-zinc-200 bg-white px-4 md:px-6 dark:border-zinc-800 dark:bg-zinc-950">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="h-9 w-9 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
            {pageTitle}
          </h2>

          <div className="ml-auto flex items-center gap-3">
            {me && (
              <>
                <div className="hidden items-center gap-1.5 sm:flex">
                  <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {me.organization.organizationName}
                  </span>
                </div>

                <div className="hidden h-4 w-px bg-zinc-200 dark:bg-zinc-700 sm:block" />

                <div className="flex items-center gap-2.5">
                  <div className="hidden text-right sm:block">
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      {me.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      {me.role}
                    </p>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    {getInitials(me.name)}
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      {/* WhatsApp Support Button */}
      <WhatsAppSupport />
    </div>
  );
}
