"use client";

import { useProducts } from "@/hooks/useProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  AlertCircle,
  RefreshCw,
  Trash2,
  Edit,
  Tags,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AddProductForm from "@/components/forms/AddProductForm";
import { useState } from "react";
import { Product } from "@/types";
import apiRequest from "@/lib/api";

type Toast = { type: "success" | "error"; message: string } | null;

export default function ProductsPage() {
  const { products, loading, error, fetchProducts } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const formatGHS = (amount: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(amount);

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    setConfirmDelete(null);
    try {
      await apiRequest(`/products/${confirmDelete.id}`, { method: "DELETE" });
      await fetchProducts();
      showToast("success", `"${confirmDelete.name}" deleted successfully.`);
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalValue = products.reduce(
    (sum, p) => sum + p.costPrice * p.quantity,
    0,
  );
  const lowStockCount = products.filter((p) => p.quantity <= 10).length;
  const categoryCount = new Set(products.map((p) => p.category.name)).size;

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="max-w-md border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h3 className="mb-1 text-lg font-semibold text-red-700 dark:text-red-400">
              Error loading products
            </h3>
            <p className="mb-5 text-sm text-red-600 dark:text-red-300">
              {error}
            </p>
            <Button
              onClick={() => fetchProducts()}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-100"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 text-red-600" />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-sm border-zinc-200 shadow-2xl dark:border-zinc-700">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mb-1 text-base font-semibold">Delete product?</h3>
              <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {confirmDelete.name}
                </span>{" "}
                will be permanently removed. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 text-white hover:bg-red-700"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your inventory — {products.length} product
            {products.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button
          className="shrink-0 bg-black text-white hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
          onClick={() => setIsOpen(true)}
        >
          <Package className="mr-2 h-4 w-4" />
          Add product
        </Button>
      </div>

      {/* Stats */}
      {products.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total products",
              value: products.length,
              icon: Package,
              color: "text-orange-500",
              bg: "bg-orange-50 dark:bg-orange-950/20",
            },
            {
              label: "Inventory value",
              value: formatGHS(totalValue),
              icon: TrendingUp,
              color: "text-emerald-600",
              bg: "bg-emerald-50 dark:bg-emerald-950/20",
            },
            {
              label: "Low stock items",
              value: lowStockCount,
              icon: AlertCircle,
              color: "text-red-500",
              bg: "bg-red-50 dark:bg-red-950/20",
              highlight: lowStockCount > 0,
            },
            {
              label: "Categories",
              value: categoryCount,
              icon: Tags,
              color: "text-blue-500",
              bg: "bg-blue-50 dark:bg-blue-950/20",
            },
          ].map(({ label, value, icon: Icon, color, bg, highlight }) => (
            <Card
              key={label}
              className={`border-zinc-200 dark:border-zinc-800 ${highlight ? "border-red-200 dark:border-red-800" : ""}`}
            >
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {label}
                  </p>
                  <p className="mt-1.5 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {value}
                  </p>
                </div>
                <div className={`rounded-lg p-2.5 ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            All products
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                <Package className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                No products yet
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Get started by adding your first product.
              </p>
              <Button
                className="mt-5 bg-black text-white hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
                onClick={() => setIsOpen(true)}
              >
                Add product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <TableHead className="h-11 pl-6 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Product
                    </TableHead>
                    <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Category
                    </TableHead>
                    <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Cost
                    </TableHead>
                    <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Price
                    </TableHead>
                    <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Stock
                    </TableHead>
                    <TableHead className="h-11 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const stockColor =
                      product.quantity === 0
                        ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                        : product.quantity <= 10
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";

                    return (
                      <TableRow
                        key={product.id}
                        className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50/70 dark:border-zinc-800 dark:hover:bg-zinc-900/40"
                      >
                        <TableCell className="py-4 pl-6 font-medium text-zinc-900 dark:text-zinc-100">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-950/30 dark:text-orange-400">
                            {product.category.name}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-sm text-zinc-500 dark:text-zinc-400">
                          {formatGHS(product.costPrice)}
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatGHS(product.sellingPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${stockColor}`}
                          >
                            {product.quantity === 0
                              ? "Out of stock"
                              : product.quantity <= 10
                                ? `${product.quantity} — low`
                                : product.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletingId === product.id}
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsOpen(true);
                              }}
                              className="h-8 w-8 p-0 text-zinc-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:text-blue-400"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletingId === product.id}
                              onClick={() => setConfirmDelete(product)}
                              className="h-8 w-8 p-0 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddProductForm
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={() => {
          fetchProducts();
          setIsOpen(false);
          setSelectedProduct(null);
          showToast(
            "success",
            selectedProduct
              ? "Product updated successfully."
              : "Product added successfully.",
          );
        }}
        product={selectedProduct || undefined}
      />
    </div>
  );
}
