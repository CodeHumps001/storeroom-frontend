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
  ShoppingCart,
  AlertCircle,
  RefreshCw,
  Receipt,
  TrendingUp,
  Package,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import apiRequest from "@/lib/api";
import { getToken } from "@/lib/auth";

interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Sale {
  id: string;
  createdAt: string;
  totalAmount: number;
  paymentMethod: string | null;
  change: number;
  items: SaleItem[];
}

type Toast = { type: "success" | "error"; message: string } | null;

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/sales", {
        method: "GET",
      });
      setSales(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleReceipt = async (saleId: string) => {
    try {
      const token = getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sales/${saleId}/receipt`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to generate receipt");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err: any) {
      showToast("error", err.message || "Failed to open receipt");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatGHS = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getPaymentMethodBadge = (method: string | null | undefined) => {
    if (!method) {
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    }

    switch (method.toLowerCase()) {
      case "cash":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400";
      case "card":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
      case "mobile_money":
      case "mobile money":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalItems = sales.reduce((sum, sale) => sum + sale.items.length, 0);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">Loading sales...</p>
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
              Error loading sales
            </h3>
            <p className="mb-5 text-sm text-red-600 dark:text-red-300">
              {error}
            </p>
            <Button
              onClick={() => fetchSales()}
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

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sales</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Track your transaction history — {sales.length} sale
            {sales.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {/* Stats */}
      {sales.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Total Revenue
                </p>
                <p className="mt-1.5 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {formatGHS(totalSales)}
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2.5 dark:bg-emerald-950/20">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Total Transactions
                </p>
                <p className="mt-1.5 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {sales.length}
                </p>
              </div>
              <div className="rounded-lg bg-orange-50 p-2.5 dark:bg-orange-950/20">
                <ShoppingCart className="h-5 w-5 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Items Sold
                </p>
                <p className="mt-1.5 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {totalItems}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-950/20">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            All transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                <ShoppingCart className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                No sales yet
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                When you make your first sale, it will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <TableHead className="h-11 pl-6 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Date & Time
                    </TableHead>
                    <TableHead className="h-11 text-center text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Items
                    </TableHead>
                    <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Total Amount
                    </TableHead>
                    <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Payment Method
                    </TableHead>
                    <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Change
                    </TableHead>
                    <TableHead className="h-11 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow
                      key={sale.id}
                      className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50/70 dark:border-zinc-800 dark:hover:bg-zinc-900/40"
                    >
                      <TableCell className="py-4 pl-6 text-sm text-zinc-600 dark:text-zinc-400">
                        {formatDate(sale.createdAt)}
                      </TableCell>
                      <TableCell className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                        {sale.items.length}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-zinc-900 dark:text-zinc-100">
                        {formatGHS(sale.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getPaymentMethodBadge(sale.paymentMethod)}`}
                        >
                          {sale.paymentMethod
                            ? sale.paymentMethod
                                .replace(/_/g, " ")
                                .toUpperCase()
                            : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm text-zinc-600 dark:text-zinc-400">
                        {formatGHS(sale.change)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReceipt(sale.id)}
                          className="h-8 w-8 p-0 text-zinc-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:text-blue-400"
                        >
                          <Receipt className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
