"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, ScanLine, ShoppingBag, Smartphone } from "lucide-react";
import { deleteToken } from "@/lib/auth";

interface PosHeaderProps {
  me: {
    name: string;
    role: string;
    organization?: { organizationName?: string };
  } | null;
  cartCount: number;
  phoneConnected: boolean;
  onScan: () => void;
  onPairPhone: () => void;
  onOpenCart: () => void;
}

// Square icon buttons on phones, icon + label from the sm breakpoint up
const outlineBtn =
  "flex h-9 w-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 transition-colors hover:border-orange-400 hover:text-orange-500 dark:border-zinc-700 dark:text-zinc-300 sm:w-auto sm:px-3";

export default function PosHeader({
  me,
  cartCount,
  phoneConnected,
  onScan,
  onPairPhone,
  onOpenCart,
}: PosHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (
      cartCount > 0 &&
      !window.confirm("The cart has items that will be lost. Log out anyway?")
    ) {
      return;
    }
    deleteToken();
    router.replace("/login");
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-zinc-200 bg-white px-3 dark:border-zinc-800 dark:bg-zinc-950 sm:px-4">
      {/* Left: brand + shop name (min-w-0 lets it shrink instead of pushing buttons off-screen) */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex shrink-0 items-center gap-2">
          <div className="relative h-7 w-7 overflow-hidden rounded-md">
            <Image
              src="/logo.jpeg"
              alt="Storeroom Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-semibold">
            <span className="text-black dark:text-white">Store</span>
            <span className="text-orange-500">room</span>
            <span className="ml-1 text-xs font-normal text-zinc-500">POS</span>
          </span>
        </div>

        {me?.organization?.organizationName && (
          <>
            <div className="hidden h-5 w-px bg-zinc-200 dark:bg-zinc-800 md:block" />
            <span className="hidden truncate text-xs font-medium text-zinc-600 dark:text-zinc-300 md:block md:max-w-[140px] xl:max-w-none">
              {me.organization.organizationName}
            </span>
          </>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex shrink-0 items-center gap-2">
        {me && (
          <span className="hidden max-w-[180px] truncate text-xs text-zinc-500 dark:text-zinc-400 lg:block">
            {me.name} · {me.role}
          </span>
        )}

        <button onClick={onScan} className={outlineBtn} aria-label="Scan products">
          <ScanLine className="h-4 w-4" />
          <span className="hidden sm:inline">Scan</span>
        </button>

        <button
          onClick={onPairPhone}
          className={`${outlineBtn} hidden lg:flex`}
          aria-label="Pair phone"
        >
          <Smartphone className="h-4 w-4" />
          Pair phone
          {phoneConnected && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          onClick={onOpenCart}
          className="relative flex h-9 w-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-black text-xs font-medium text-white sm:w-auto sm:px-3 lg:hidden"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold">
              {cartCount}
            </span>
          )}
        </button>

        <button
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
          className="flex h-9 w-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-400 md:w-auto md:px-3"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}