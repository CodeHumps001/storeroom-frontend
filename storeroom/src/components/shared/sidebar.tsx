"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Package,
  Tags,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  LogOut,
  LayoutDashboard,
  X,
} from "lucide-react";
import { deleteToken } from "@/lib/auth";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/sales", label: "Sales", icon: ShoppingCart },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/staff", label: "Staff", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    deleteToken();
    router.push("/login");
  };

  return (
    <aside className="flex h-full flex-col border-r border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-5 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-xs font-bold text-white dark:bg-white dark:text-black">
            SR
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Storeroom
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 lg:hidden dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
          Menu
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
                }`}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-zinc-100 px-3 py-4 dark:border-zinc-800">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-950/20 dark:hover:text-red-400"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          Log out
        </button>
      </div>
    </aside>
  );
}
