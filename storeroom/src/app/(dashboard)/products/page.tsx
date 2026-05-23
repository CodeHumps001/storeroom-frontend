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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import AddProductForm from "@/components/forms/AddProductForm";
import { useState } from "react";
import { Product } from "@/types";
import apiRequest from "@/lib/api";

export default function ProductsPage() {
  const { products, loading, error, fetchProducts } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const formatGHS = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleDelete = async (id: string, productName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/products/${id}`, {
        method: "DELETE",
      });

      await fetchProducts();
      alert("Product deleted successfully!");
    } catch (err: any) {
      alert(`Failed to delete product: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="max-w-md border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="p-6 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h3 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-400">
              Error Loading Products
            </h3>
            <p className="mb-4 text-sm text-red-600 dark:text-red-300">
              {error}
            </p>
            <Button
              onClick={() => fetchProducts()}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-100 dark:border-red-700 dark:text-red-400"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your inventory products
          </p>
        </div>
        <Button
          className="bg-black hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
          onClick={() => setIsOpen(true)}
        >
          <Package className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Summary Stats */}
      {/* Summary Stats */}
      {products.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Products
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    {products.length}
                  </p>
                </div>
                <div className="rounded-md bg-primary/10 p-2">
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Value
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    {formatGHS(
                      products.reduce(
                        (sum, p) => sum + p.costPrice * p.quantity,
                        0,
                      ),
                    )}
                  </p>
                </div>
                <div className="rounded-md bg-primary/10 p-2">
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Low Stock Items
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    {products.filter((p) => p.quantity <= 10).length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Items with quantity ≤ 10
                  </p>
                </div>
                <div className="rounded-md bg-destructive/10 p-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Categories
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    {new Set(products.map((p) => p.category.name)).size}
                  </p>
                </div>
                <div className="rounded-md bg-primary/10 p-2">
                  <Tags className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products Table */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <p className="text-sm text-zinc-500">
            {products.length} product{products.length !== 1 ? "s" : ""} found
          </p>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-zinc-400" />
              <h3 className="mt-4 text-lg font-semibold">No products found</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Get started by adding your first product
              </p>
              <Button
                className="mt-4 bg-black hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
                onClick={() => setIsOpen(true)}
              >
                Add Product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 dark:border-zinc-800">
                    <TableHead className="h-12 font-semibold">
                      Product Name
                    </TableHead>
                    <TableHead className="h-12 font-semibold">
                      Category
                    </TableHead>
                    <TableHead className="h-12 font-semibold text-right">
                      Cost Price
                    </TableHead>
                    <TableHead className="h-12 font-semibold text-right">
                      Selling Price
                    </TableHead>
                    <TableHead className="h-12 font-semibold text-right">
                      Quantity
                    </TableHead>
                    <TableHead className="h-12 text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      className="group h-16 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      <TableCell className="align-middle font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="align-middle">
                        <span className="inline-flex rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700 dark:bg-orange-950/30 dark:text-orange-400">
                          {product.category.name}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle text-right">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {formatGHS(product.costPrice)}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle text-right">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatGHS(product.sellingPrice)}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold ${
                              product.quantity <= 10
                                ? "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                                : product.quantity <= 20
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                            }`}
                          >
                            {product.quantity}
                          </span>
                          {product.quantity <= 10 && (
                            <span className="text-xs text-red-500">
                              Low stock
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsOpen(true);
                            }}
                            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
        }}
        product={selectedProduct || undefined}
      />
    </div>
  );
}
