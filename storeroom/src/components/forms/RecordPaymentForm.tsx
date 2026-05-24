"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiRequest from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Credit } from "@/types";

interface RecordPaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  credit: Credit | null;
}

export default function RecordPaymentForm({
  open,
  onClose,
  onSuccess,
  credit,
}: RecordPaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setAmount("");
      setError("");
    }
  }, [open]);

  const balance = credit ? credit.amount - credit.amountPaid : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credit) return;

    const paid = parseFloat(amount);
    if (!amount || isNaN(paid) || paid <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (paid > balance) {
      setError(`Amount cannot exceed balance of GHS ${balance.toFixed(2)}`);
      return;
    }

    setLoading(true);
    try {
      await apiRequest(`/credits/${credit.id}/payment`, {
        method: "PATCH",
        body: JSON.stringify({ amountPaid: paid }),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  if (!credit) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Record Payment
          </DialogTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Record a payment from {credit.customerName}
          </p>
        </DialogHeader>

        {/* Credit summary */}
        <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Total owed</span>
            <span className="font-medium">GHS {credit.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Already paid</span>
            <span className="font-medium text-emerald-600">
              GHS {credit.amountPaid.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 dark:border-zinc-700">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Balance
            </span>
            <span className="font-bold text-orange-600">
              GHS {balance.toFixed(2)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentAmount" className="text-sm font-medium">
              Amount Being Paid (GHS)
            </Label>
            <Input
              id="paymentAmount"
              type="number"
              step="0.01"
              min="0"
              max={balance}
              placeholder={`Max: ${balance.toFixed(2)}`}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              className="h-10"
              autoFocus
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          {/* Quick fill buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAmount((balance / 2).toFixed(2))}
              className="flex-1 rounded-lg border border-zinc-200 py-1.5 text-xs font-medium text-zinc-600 hover:border-orange-400 hover:text-orange-500 dark:border-zinc-700 dark:text-zinc-400"
            >
              Half
            </button>
            <button
              type="button"
              onClick={() => setAmount(balance.toFixed(2))}
              className="flex-1 rounded-lg border border-zinc-200 py-1.5 text-xs font-medium text-zinc-600 hover:border-orange-400 hover:text-orange-500 dark:border-zinc-700 dark:text-zinc-400"
            >
              Full amount
            </button>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                "Record Payment"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
