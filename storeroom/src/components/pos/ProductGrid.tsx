"use client";

import { Product } from "@/types";
import { Plus } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ProductGrid({
  products,
  onAddToCart,
}: ProductGridProps) {
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onAddToCart(product)}
          className="group relative cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-orange-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-500"
        >
          {/* Image */}
          <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-4xl font-bold text-zinc-300 dark:text-zinc-600">
                  {product.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Quick add overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
              <div className="flex h-10 w-10 scale-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-transform duration-200 group-hover:scale-100">
                <Plus className="h-5 w-5" />
              </div>
            </div>

            {/* Stock badge */}
            {product.quantity <= 10 && (
              <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {product.quantity === 0 ? "Out" : `${product.quantity} left`}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {product.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-zinc-400 dark:text-zinc-500">
              {product.category.name}
            </p>
            <p className="mt-2 text-base font-bold text-emerald-600 dark:text-emerald-400">
              GHS {product.sellingPrice.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
