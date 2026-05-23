"use client";

import { useState, useEffect } from "react";
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
  TrendingUp,
  ShoppingCart,
  Package,
  AlertCircle,
  Receipt,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import apiRequest from "@/lib/api";
import Link from "next/link";

interface Sale {
  id: string;
  createdAt: string;
  totalAmount: number;
  paymentMethod: string | null;
  items: Array<{ id: string }>;
}

interface LowStockItem {
  id: string;
  name: string;
  quantity: number;
  sellingPrice: number;
}

interface TopProductItem {
  productId: string;
  productName: string;
  _sum: { quantity: number | null };
}

interface DashboardData {
  recentSales: Sale[];
  totalRevenue: number;
  totalSales: number;
  totalProducts: number;
  lowStockItems: LowStockItem[];
  topProducts: TopProductItem[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>({
    recentSales: [],
    totalRevenue: 0,
    totalSales: 0,
    totalProducts: 0,
    lowStockItems: [],
    topProducts: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [salesRes, productsRes, lowStockRes, topProductsRes] =
        await Promise.all([
          apiRequest("/sales"),
          apiRequest("/products"),
          apiRequest("/reports/low-stock"),
          apiRequest("/reports/top-products"),
        ]);

      const sales: Sale[] = salesRes.data || [];
      const products = productsRes.data || [];
      const lowStockItems: LowStockItem[] = lowStockRes.data || [];
      const topProducts: TopProductItem[] = topProductsRes.data || [];

      const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
      const recentSales = [...sales].reverse().slice(0, 5);

      setData({
        recentSales,
        totalRevenue,
        totalSales: sales.length,
        totalProducts: products.length,
        lowStockItems,
        topProducts,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatGHS = (amount: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(amount);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">Loading dashboard...</p>
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
              Error loading dashboard
            </h3>
            <p className="mb-5 text-sm text-red-600 dark:text-red-300">
              {error}
            </p>
            <Button
              onClick={fetchDashboardData}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-100"
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lowStockCount = data.lowStockItems.length;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
          Here's what's happening with your business.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Revenue",
            value: formatGHS(data.totalRevenue),
            icon: TrendingUp,
            bg: "bg-emerald-50 dark:bg-emerald-950/20",
            color: "text-emerald-600 dark:text-emerald-400",
            valueColor: "text-zinc-900 dark:text-zinc-100",
          },
          {
            label: "Total Sales",
            value: data.totalSales,
            icon: ShoppingCart,
            bg: "bg-blue-50 dark:bg-blue-950/20",
            color: "text-blue-600 dark:text-blue-400",
            valueColor: "text-zinc-900 dark:text-zinc-100",
          },
          {
            label: "Total Products",
            value: data.totalProducts,
            icon: Package,
            bg: "bg-orange-50 dark:bg-orange-950/20",
            color: "text-orange-500",
            valueColor: "text-zinc-900 dark:text-zinc-100",
          },
          {
            label: "Low Stock",
            value: lowStockCount,
            icon: AlertCircle,
            bg:
              lowStockCount > 0
                ? "bg-red-50 dark:bg-red-950/20"
                : "bg-zinc-50 dark:bg-zinc-800",
            color: lowStockCount > 0 ? "text-red-500" : "text-zinc-400",
            valueColor:
              lowStockCount > 0
                ? "text-red-600 dark:text-red-400"
                : "text-zinc-900 dark:text-zinc-100",
          },
        ].map(({ label, value, icon: Icon, bg, color, valueColor }) => (
          <Card key={label} className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {label}
                </p>
                <p
                  className={`mt-2 text-2xl font-bold tracking-tight ${valueColor}`}
                >
                  {value}
                </p>
              </div>
              <div className={`rounded-lg p-3 ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Sales */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">
                Recent Sales
              </CardTitle>
              <p className="text-xs text-zinc-500">Latest 5 transactions</p>
            </div>
            <Link href="/sales">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-xs text-orange-500 hover:text-orange-600"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentSales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Receipt className="h-10 w-10 text-zinc-300" />
                <p className="mt-2 text-sm text-zinc-500">No sales yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <TableHead className="h-10 pl-6 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Date
                    </TableHead>
                    <TableHead className="h-10 text-center text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Items
                    </TableHead>
                    <TableHead className="h-10 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentSales.map((sale) => (
                    <TableRow
                      key={sale.id}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                    >
                      <TableCell className="py-3 pl-6 text-sm text-zinc-600 dark:text-zinc-400">
                        {formatDate(sale.createdAt)}
                      </TableCell>
                      <TableCell className="py-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
                        {sale.items.length}
                      </TableCell>
                      <TableCell className="py-3 pr-6 text-right text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatGHS(sale.totalAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">
                  Low Stock
                </CardTitle>
                {lowStockCount > 0 && (
                  <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-400">
                    {lowStockCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500">Items needing attention</p>
            </div>
            <Link href="/products">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-xs text-orange-500 hover:text-orange-600"
              >
                Manage <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.lowStockItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/20">
                  <Package className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  All stock levels healthy
                </p>
                <p className="text-xs text-zinc-400">
                  No items need restocking
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.lowStockItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50/60 px-3 py-2.5 dark:border-red-900/30 dark:bg-red-950/10"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {item.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {item.quantity === 0
                          ? "Out of stock"
                          : `${item.quantity} left`}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${
                        item.quantity === 0
                          ? "bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      }`}
                    >
                      {item.quantity}
                    </span>
                  </div>
                ))}
                {lowStockCount > 5 && (
                  <p className="pt-1 text-center text-xs text-zinc-400">
                    +{lowStockCount - 5} more items
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-orange-50 p-1.5 dark:bg-orange-950/20">
              <BarChart3 className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Top Selling Products
              </CardTitle>
              <p className="text-xs text-zinc-500">
                Best performers by units sold
              </p>
            </div>
          </div>
          <Link href="/reports">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs text-orange-500 hover:text-orange-600"
            >
              Full report <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {data.topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 className="h-10 w-10 text-zinc-300" />
              <p className="mt-2 text-sm text-zinc-500">No sales data yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <TableHead className="h-10 pl-6 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    #
                  </TableHead>
                  <TableHead className="h-10 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Product
                  </TableHead>
                  <TableHead className="h-10 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Units Sold
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topProducts.slice(0, 5).map((product, index) => (
                  <TableRow
                    key={product.productId}
                    className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50/70 dark:border-zinc-800 dark:hover:bg-zinc-900/40"
                  >
                    <TableCell className="py-3 pl-6">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          index === 0
                            ? "bg-orange-500 text-white"
                            : index === 1
                              ? "bg-zinc-300 text-zinc-700 dark:bg-zinc-600 dark:text-zinc-200"
                              : index === 2
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {product.productName}
                    </TableCell>
                    <TableCell className="py-3 pr-6 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                      {product._sum.quantity ?? 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
