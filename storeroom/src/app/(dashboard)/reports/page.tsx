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
  Wallet,
  Package,
  AlertCircle,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import apiRequest from "@/lib/api";

interface SummaryData {
  totalRevenue: number | null;
  totalSales: number;
  totalProfit: number;
}

interface TopProductItem {
  productId: string;
  productName: string;
  _sum: { quantity: number | null };
}

interface StockValueData {
  stockValue: number;
}

interface LowStockItem {
  id: string;
  name: string;
  quantity: number;
  sellingPrice: number;
  costPrice: number;
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [topProducts, setTopProducts] = useState<TopProductItem[]>([]);
  const [stockValue, setStockValue] = useState<StockValueData | null>(null);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, topProductsRes, stockValueRes, lowStockRes] =
        await Promise.all([
          apiRequest("/reports/summary"),
          apiRequest("/reports/top-products"),
          apiRequest("/reports/stock-value"),
          apiRequest("/reports/low-stock"),
        ]);
      setSummary(summaryRes.data);
      setTopProducts(topProductsRes.data);
      setStockValue(stockValueRes.data);
      setLowStock(lowStockRes.data);
    } catch (err: any) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const formatGHS = (amount: number | null | undefined) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(amount ?? 0);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">Loading reports...</p>
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
            <h3 className="mb-1 text-lg font-semibold text-red-700">
              Error loading reports
            </h3>
            <p className="mb-5 text-sm text-red-600">{error}</p>
            <Button
              onClick={fetchReports}
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
          Analytics and insights for your business
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Revenue",
            value: formatGHS(summary?.totalRevenue),
            sub: "All time sales",
            icon: TrendingUp,
            iconBg: "bg-emerald-50 dark:bg-emerald-950/20",
            iconColor: "text-emerald-600",
            valueColor: "text-zinc-900 dark:text-zinc-100",
          },
          {
            label: "Total Transactions",
            value: summary?.totalSales ?? 0,
            sub: "Completed sales",
            icon: ShoppingCart,
            iconBg: "bg-blue-50 dark:bg-blue-950/20",
            iconColor: "text-blue-600",
            valueColor: "text-zinc-900 dark:text-zinc-100",
          },
          {
            label: "Total Profit",
            value: formatGHS(summary?.totalProfit),
            sub: "Gross profit",
            icon: Wallet,
            iconBg: "bg-purple-50 dark:bg-purple-950/20",
            iconColor: "text-purple-600",
            valueColor: "text-emerald-600 dark:text-emerald-400",
          },
        ].map(
          ({
            label,
            value,
            sub,
            icon: Icon,
            iconBg,
            iconColor,
            valueColor,
          }) => (
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
                  <p className="mt-1 text-xs text-zinc-400">{sub}</p>
                </div>
                <div className={`rounded-lg p-3 ${iconBg}`}>
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </div>

      {/* Stock Value + Low Stock */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stock Value */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-orange-50 p-1.5 dark:bg-orange-950/20">
                <Package className="h-4 w-4 text-orange-500" />
              </div>
              <CardTitle className="text-base font-semibold">
                Inventory Value
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="rounded-xl bg-zinc-50 p-5 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Total Stock Value (at cost)
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {formatGHS(stockValue?.stockValue)}
              </p>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Based on cost price × current quantity for all products.
            </p>
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-red-50 p-1.5 dark:bg-red-950/20">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
                <CardTitle className="text-base font-semibold">
                  Low Stock Alerts
                </CardTitle>
              </div>
              {lowStock.length > 0 && (
                <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-400">
                  {lowStock.length} item{lowStock.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500">Products with quantity ≤ 10</p>
          </CardHeader>
          <CardContent className="p-0">
            {lowStock.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Package className="h-10 w-10 text-zinc-300" />
                <p className="mt-2 text-sm font-medium text-zinc-500">
                  All products well stocked
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <TableHead className="h-10 pl-6 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Product
                    </TableHead>
                    <TableHead className="h-10 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Stock
                    </TableHead>
                    <TableHead className="h-10 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Value
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStock.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                    >
                      <TableCell className="py-3 pl-6 font-medium text-zinc-900 dark:text-zinc-100">
                        {item.name}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                            item.quantity === 0
                              ? "bg-red-200 text-red-800"
                              : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                          }`}
                        >
                          {item.quantity === 0 ? "Out of stock" : item.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 pr-6 text-right text-sm text-zinc-500">
                        {formatGHS(item.quantity * item.sellingPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-orange-50 p-1.5 dark:bg-orange-950/20">
              <BarChart3 className="h-4 w-4 text-orange-500" />
            </div>
            <CardTitle className="text-base font-semibold">
              Top Selling Products
            </CardTitle>
          </div>
          <p className="text-xs text-zinc-500">
            Best performing products by units sold
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 className="h-10 w-10 text-zinc-300" />
              <p className="mt-2 text-sm text-zinc-500">
                No sales data available yet
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <TableHead className="h-11 pl-6 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    #
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Product
                  </TableHead>
                  <TableHead className="h-11 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Units Sold
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product, index) => (
                  <TableRow
                    key={product.productId}
                    className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50/70 dark:border-zinc-800 dark:hover:bg-zinc-900/40"
                  >
                    <TableCell className="py-4 pl-6">
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
                    <TableCell className="py-4 font-medium text-zinc-900 dark:text-zinc-100">
                      {product.productName}
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right font-semibold text-zinc-900 dark:text-zinc-100">
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
