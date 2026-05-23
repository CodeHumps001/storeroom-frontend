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
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/categories",
    label: "Categories",
    icon: Tags,
  },
  {
    href: "/sales",
    label: "Sales",
    icon: ShoppingCart,
  },
  {
    href: "/reports",
    label: "Reports",
    icon: BarChart3,
  },
  {
    href: "/staff",
    label: "Staff",
    icon: Users,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
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

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className="flex h-full flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-bold text-white dark:bg-white dark:text-black">
            IP
          </div>
          <span className="text-lg font-bold tracking-tight">InventoryPro</span>
        </div>

        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-zinc-100 lg:hidden dark:hover:bg-zinc-900"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <button
          onClick={handleLogout}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-lg
            px-3
            py-2.5
            text-sm
            font-medium
            text-red-600
            transition-all
            duration-200
            hover:bg-red-50
            dark:text-red-400
            dark:hover:bg-red-950/20
          "
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
