"use client";

import { useState } from "react";
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
  CreditCard,
  AlertCircle,
  RefreshCw,
  Trash2,
  Plus,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  HandCoins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import apiRequest from "@/lib/api";
import AddCreditForm from "@/components/forms/AddCreditForm";
import RecordPaymentForm from "@/components/forms/RecordPaymentForm";
import { Credit } from "@/types";
import { useCredits } from "@/hooks/useCredits";

type Toast = { type: "success" | "error"; message: string } | null;

function getStatus(credit: Credit) {
  if (credit.isPaid) return "PAID";
  if (credit.amountPaid > 0) return "PARTIAL";
  return "UNPAID";
}

function getStatusStyle(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400";
    case "PARTIAL":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400";
    default:
      return "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400";
  }
}

export default function CreditsPage() {
  const { credits, loading, error, fetchCredits, meta } = useCredits();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Credit | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    setConfirmDelete(null);
    try {
      await apiRequest(`/credits/${confirmDelete.id}`, { method: "DELETE" });
      await fetchCredits();
      showToast(
        "success",
        `Credit for "${confirmDelete.customerName}" deleted.`,
      );
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete credit");
    } finally {
      setDeletingId(null);
    }
  };

  const formatGHS = (amount: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(amount);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">Loading credits...</p>
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
              Error loading credits
            </h3>
            <p className="mb-5 text-sm text-red-600 dark:text-red-300">
              {error}
            </p>
            <Button
              onClick={fetchCredits}
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
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${
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

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-sm border-zinc-200 shadow-2xl dark:border-zinc-700">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mb-1 text-base font-semibold">
                Delete credit entry?
              </h3>
              <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">
                Permanently delete the credit for{" "}
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {confirmDelete.customerName}
                </span>
                . This cannot be undone.
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
          <h1 className="text-2xl font-semibold tracking-tight">Credits</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Track customer debts and record payments
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="shrink-0 bg-black text-white hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Credit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Records",
            value: meta.total,
            icon: CreditCard,
            bg: "bg-blue-50 dark:bg-blue-950/20",
            color: "text-blue-600 dark:text-blue-400",
            valueColor: "text-zinc-900 dark:text-zinc-100",
          },
          {
            label: "Unpaid Credits",
            value: meta.unpaid,
            icon: Users,
            bg: "bg-red-50 dark:bg-red-950/20",
            color: "text-red-500",
            valueColor:
              meta.unpaid > 0
                ? "text-red-600 dark:text-red-400"
                : "text-zinc-900 dark:text-zinc-100",
          },
          {
            label: "Total Owed",
            value: formatGHS(meta.totalOwed),
            icon: TrendingUp,
            bg: "bg-orange-50 dark:bg-orange-950/20",
            color: "text-orange-500",
            valueColor: "text-orange-600 dark:text-orange-400",
          },
        ].map(({ label, value, icon: Icon, bg, color, valueColor }) => (
          <Card key={label} className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {label}
                </p>
                <p
                  className={`mt-1.5 text-2xl font-bold tracking-tight ${valueColor}`}
                >
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

      {/* Table */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            All Credit Records
          </CardTitle>
          <p className="text-xs text-zinc-500">
            {credits.length} record{credits.length !== 1 ? "s" : ""} total
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {credits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                <HandCoins className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                No credit records yet
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Add your first credit entry to start tracking.
              </p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-5 bg-black text-white hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Credit
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <TableHead className="h-11 pl-6 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Customer
                    </TableHead>
                    <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Phone
                    </TableHead>
                    <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Amount
                    </TableHead>
                    <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Paid
                    </TableHead>
                    <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Balance
                    </TableHead>
                    <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Status
                    </TableHead>
                    <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Date
                    </TableHead>
                    <TableHead className="h-11 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credits.map((credit) => {
                    const balance = credit.amount - credit.amountPaid;
                    const status = getStatus(credit);
                    return (
                      <TableRow
                        key={credit.id}
                        className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50/70 dark:border-zinc-800 dark:hover:bg-zinc-900/40"
                      >
                        <TableCell className="py-4 pl-6 font-medium text-zinc-900 dark:text-zinc-100">
                          <div>
                            <p>{credit.customerName}</p>
                            {credit.note && (
                              <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate max-w-[150px]">
                                {credit.note}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-zinc-500 dark:text-zinc-400">
                          {credit.customerPhone ?? "—"}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {formatGHS(credit.amount)}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          {formatGHS(credit.amountPaid)}
                        </TableCell>
                        <TableCell className="text-right text-sm font-bold text-orange-600 dark:text-orange-400">
                          {formatGHS(balance)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusStyle(status)}`}
                          >
                            {status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-zinc-500 dark:text-zinc-400">
                          {formatDate(credit.createdAt)}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {!credit.isPaid && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedCredit(credit);
                                  setIsPaymentModalOpen(true);
                                }}
                                className="h-8 w-8 p-0 text-zinc-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:text-blue-400"
                                title="Record payment"
                              >
                                <DollarSign className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletingId === credit.id}
                              onClick={() => setConfirmDelete(credit)}
                              className="h-8 w-8 p-0 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                              title="Delete"
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

      <AddCreditForm
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchCredits();
          setIsAddModalOpen(false);
          showToast("success", "Credit added successfully!");
        }}
      />

      <RecordPaymentForm
        open={isPaymentModalOpen}
        credit={selectedCredit}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedCredit(null);
        }}
        onSuccess={() => {
          fetchCredits();
          setIsPaymentModalOpen(false);
          setSelectedCredit(null);
          showToast("success", "Payment recorded successfully!");
        }}
      />
    </div>
  );
}
