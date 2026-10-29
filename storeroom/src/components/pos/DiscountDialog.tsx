"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import apiRequest from "@/lib/api";

export type AppliedDiscount = {
  couponCode?: string;
  manual?: { type: "PERCENTAGE" | "FIXED_AMOUNT"; value: number; reason: string };
};

export type PricingPreview = {
  subtotal: number;
  discountAmount: number;
  total: number;
  discountSource: "COUPON" | "MANUAL" | null;
  couponCode: string | null;
  discountNote: string | null;
  belowCost: boolean;
};

interface DiscountDialogProps {
  open: boolean;
  onClose: () => void;
  items: { productId: string; quantity: number }[];
  role?: string;
  onApply: (discount: AppliedDiscount, pricing: PricingPreview) => void;
}

const REASONS = ["Damaged item", "Loyal customer", "Bulk purchase", "Price match"];

export default function DiscountDialog({
  open,
  onClose,
  items,
  role,
  onApply,
}: DiscountDialogProps) {
  const [tab, setTab] = useState<"coupon" | "manual">("coupon");
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [maxPercent, setMaxPercent] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setError("");
    apiRequest("/coupons/policy")
      .then((r) => setMaxPercent(r.data.maxCashierDiscountPercent))
      .catch(() => {});
  }, [open]);

  const submit = async (discount: AppliedDiscount) => {
    setLoading(true);
    setError("");
    try {
      // The server prices the cart and enforces every rule; we only show its answer
      const res = await apiRequest("/coupons/preview", {
        method: "POST",
        body: JSON.stringify({
          items,
          couponCode: discount.couponCode,
          manualDiscount: discount.manual,
        }),
      });
      onApply(discount, res.data);
      setCode("");
      setValue("");
      setReason("");
      onClose();
    } catch (e: any) {
      setError(e.message || "Could not apply discount");
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = () => {
    if (!code.trim()) return setError("Enter a coupon code");
    submit({ couponCode: code.trim().toUpperCase() });
  };

  const applyManual = () => {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return setError("Enter a discount amount");
    if (reason.trim().length < 3) return setError("Please give a reason");
    submit({ manual: { type, value: n, reason: reason.trim() } });
  };

  const tabBtn = (t: "coupon" | "manual", label: string) => (
    <button
      type="button"
      onClick={() => {
        setTab(t);
        setError("");
      }}
      className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
        tab === t
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      }`}
    >
      {label}
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add discount</DialogTitle>
        </DialogHeader>

        <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
          {tabBtn("coupon", "Coupon code")}
          {tabBtn("manual", "Manual discount")}
        </div>

        {tab === "coupon" ? (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="coupon-code" className="text-sm">Coupon code</Label>
              <Input
                id="coupon-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                placeholder="e.g. WELCOME10"
                className="h-10 font-mono uppercase"
                autoFocus
              />
            </div>
            <Button onClick={applyCoupon} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Apply coupon
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 space-y-1.5">
                <Label className="text-sm">Type</Label>
                <div className="flex gap-1 rounded-lg border border-zinc-200 p-1 dark:border-zinc-700">
                  {(["PERCENTAGE", "FIXED_AMOUNT"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 rounded-md py-1.5 text-xs font-semibold ${
                        type === t ? "bg-orange-500 text-white" : "text-zinc-500"
                      }`}
                    >
                      {t === "PERCENTAGE" ? "% off" : "GHS off"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-28 space-y-1.5">
                <Label htmlFor="disc-value" className="text-sm">Value</Label>
                <Input
                  id="disc-value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="disc-reason" className="text-sm">Reason (required)</Label>
              <Input
                id="disc-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why is this discount being given?"
                className="h-9"
              />
              <div className="flex flex-wrap gap-1.5">
                {REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className="rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] text-zinc-600 hover:border-orange-400 hover:text-orange-500 dark:border-zinc-700 dark:text-zinc-400"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {role === "CASHIER" && maxPercent !== null && (
              <p className="text-xs text-zinc-500">
                You can give up to {maxPercent}% off. Bigger discounts need the owner.
              </p>
            )}
            <Button onClick={applyManual} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Apply discount
            </Button>
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}