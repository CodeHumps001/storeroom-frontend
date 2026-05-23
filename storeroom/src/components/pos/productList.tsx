"use client";

import { Product } from "@/types";
import { Plus } from "lucide-react";

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ProductList({
  products,
  onAddToCart,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-3 text-4xl">🔍</div>
        <p className="text-sm font-medium text-zinc-500">No products found</p>
        <p className="text-xs text-zinc-400">Try a different search term</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onAddToCart(product)}
          className="group flex cursor-pointer items-center gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 transition-all hover:border-orange-400 hover:bg-orange-50/40 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-500 dark:hover:bg-orange-950/10"
        >
          {/* Letter avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-base font-bold text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 group-hover:bg-orange-100 group-hover:text-orange-500 dark:group-hover:bg-orange-950/30 dark:group-hover:text-orange-400 transition-colors">
            {product.name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {product.name}
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                {product.category.name}
              </span>
              {product.quantity <= 10 && (
                <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  {product.quantity === 0
                    ? "Out of stock"
                    : `${product.quantity} left`}
                </span>
              )}
            </div>
          </div>

          {/* Price + Add */}
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              GHS {product.sellingPrice.toFixed(2)}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 transition-all group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white dark:border-zinc-700 dark:bg-zinc-900">
              <Plus className="h-4 w-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
