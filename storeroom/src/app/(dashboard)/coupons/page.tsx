"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Save,
  Ticket,
  Trash2,
  XCircle,
} from "lucide-react";
import apiRequest from "@/lib/api";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  maxDiscountAmount: number | null;
  minPurchaseAmount: number | null;
  scope: "CART" | "PRODUCT" | "CATEGORY";
  productIds: string[];
  categoryIds: string[];
  startsAt: string | null;
  expiresAt: string | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
}

type Toast = { type: "success" | "error"; message: string } | null;

const statusOf = (c: Coupon) => {
  const now = Date.now();
  if (!c.isActive) return { label: "Disabled", cls: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" };
  if (c.expiresAt && new Date(c.expiresAt).getTime() < now) return { label: "Expired", cls: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400" };
  if (c.startsAt && new Date(c.startsAt).getTime() > now) return { label: "Scheduled", cls: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" };
  if (c.usageLimit !== null && c.usedCount >= c.usageLimit) return { label: "Used up", cls: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" };
  return { label: "Active", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" };
};

const describe = (c: Coupon) =>
  c.type === "PERCENTAGE"
    ? `${c.value}% off${c.maxDiscountAmount ? `, max GHS ${c.maxDiscountAmount}` : ""}`
    : `GHS ${c.value} off`;

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);
  const [editing, setEditing] = useState<Coupon | "new" | null>(null);
  const [policy, setPolicy] = useState("");
  const [savingPolicy, setSavingPolicy] = useState(false);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    try {
      const [c, p] = await Promise.all([
        apiRequest("/coupons"),
        apiRequest("/coupons/policy"),
      ]);
      setCoupons(c.data);
      setPolicy(String(p.data.maxCashierDiscountPercent));
    } catch (e: any) {
      showToast("error", e.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (c: Coupon) => {
    try {
      await apiRequest(`/coupons/${c.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !c.isActive }),
      });
      load();
    } catch (e: any) {
      showToast("error", e.message);
    }
  };

  const remove = async (c: Coupon) => {
    if (!window.confirm(`Delete coupon ${c.code}?`)) return;
    try {
      await apiRequest(`/coupons/${c.id}`, { method: "DELETE" });
      showToast("success", "Coupon deleted");
      load();
    } catch (e: any) {
      showToast("error", e.message);
    }
  };

  const savePolicy = async () => {
    setSavingPolicy(true);
    try {
      await apiRequest("/coupons/policy", {
        method: "PATCH",
        body: JSON.stringify({ maxCashierDiscountPercent: Number(policy) }),
      });
      showToast("success", "Cashier discount limit saved");
    } catch (e: any) {
      showToast("error", e.message);
    } finally {
      setSavingPolicy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-10">
      {toast && (
        <div
          className={`fixed inset-x-4 top-4 z-[70] flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg sm:inset-x-auto sm:right-6 sm:top-6 sm:max-w-sm ${
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Coupons & discounts</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Create coupon codes and control how much cashiers can discount
          </p>
        </div>
        <Button
          onClick={() => setEditing("new")}
          className="shrink-0 bg-black text-white hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          New coupon
        </Button>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-3">
        {/* Coupons table */}
        <Card className="border-zinc-200 dark:border-zinc-800 xl:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">All coupons</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {coupons.length === 0 ? (
              <div className="flex flex-col items-center py-14 text-center">
                <Ticket className="h-10 w-10 text-zinc-300" />
                <p className="mt-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">No coupons yet</p>
                <p className="text-xs text-zinc-400">Create one and cashiers can apply it at the till.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                      <TableHead className="pl-6 text-xs uppercase">Code</TableHead>
                      <TableHead className="text-xs uppercase">Discount</TableHead>
                      <TableHead className="text-xs uppercase">Valid</TableHead>
                      <TableHead className="text-right text-xs uppercase">Used</TableHead>
                      <TableHead className="text-xs uppercase">Status</TableHead>
                      <TableHead className="pr-6 text-right text-xs uppercase">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map((c) => {
                      const s = statusOf(c);
                      return (
                        <TableRow key={c.id}>
                          <TableCell className="py-3 pl-6">
                            <span className="font-mono text-sm font-semibold">{c.code}</span>
                            {c.description && (
                              <span className="block max-w-[220px] truncate text-[11px] text-zinc-400">{c.description}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {describe(c)}
                            <span className="block text-[11px] text-zinc-400">
                              {c.scope === "CART" ? "Whole basket" : c.scope === "PRODUCT" ? `${c.productIds.length} product(s)` : `${c.categoryIds.length} categor${c.categoryIds.length === 1 ? "y" : "ies"}`}
                              {c.minPurchaseAmount ? ` · min GHS ${c.minPurchaseAmount}` : ""}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-xs text-zinc-500">
                            {c.startsAt ? new Date(c.startsAt).toLocaleDateString() : "Now"} →{" "}
                            {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "No end"}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {c.usedCount}
                            {c.usageLimit !== null && <span className="text-zinc-400"> / {c.usageLimit}</span>}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>{s.label}</span>
                          </TableCell>
                          <TableCell className="pr-6 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => toggle(c)}>
                                {c.isActive ? "Disable" : "Enable"}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-blue-600" onClick={() => setEditing(c)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-red-600" onClick={() => remove(c)}>
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

        {/* Cashier policy */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Cashier discount limit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-zinc-500">
              The most a cashier can take off a sale with a manual discount. Anything bigger needs you
              (the owner). Cashiers can also never sell below cost. Coupons you create are not limited by this.
            </p>
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="policy" className="text-sm">Max % off</Label>
                <Input
                  id="policy"
                  type="number"
                  min="0"
                  max="100"
                  value={policy}
                  onChange={(e) => setPolicy(e.target.value)}
                  className="h-10"
                />
              </div>
              <Button onClick={savePolicy} disabled={savingPolicy} className="h-10">
                {savingPolicy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {!savingPolicy && "Save"}
              </Button>
            </div>
            <p className="text-xs text-zinc-400">Set to 0 to stop cashiers giving manual discounts.</p>
          </CardContent>
        </Card>
      </div>

      <CouponFormDialog
        coupon={editing === "new" ? null : editing}
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSaved={(msg) => {
          setEditing(null);
          showToast("success", msg);
          load();
        }}
      />
    </div>
  );
}

// ── Create / edit form ───────────────────────────────────────────────────────

function CouponFormDialog({
  coupon,
  open,
  onClose,
  onSaved,
}: {
  coupon: Coupon | null;
  open: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const { products } = useProducts();
  const { categories } = useCategories();

  const blank = {
    code: "",
    description: "",
    type: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT",
    value: "",
    maxDiscountAmount: "",
    minPurchaseAmount: "",
    scope: "CART" as "CART" | "PRODUCT" | "CATEGORY",
    productIds: [] as string[],
    categoryIds: [] as string[],
    startsAt: "",
    expiresAt: "",
    usageLimit: "",
  };
  const [f, setF] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setF(
      coupon
        ? {
            code: coupon.code,
            description: coupon.description ?? "",
            type: coupon.type,
            value: String(coupon.value),
            maxDiscountAmount: coupon.maxDiscountAmount?.toString() ?? "",
            minPurchaseAmount: coupon.minPurchaseAmount?.toString() ?? "",
            scope: coupon.scope,
            productIds: coupon.productIds,
            categoryIds: coupon.categoryIds,
            startsAt: coupon.startsAt?.slice(0, 10) ?? "",
            expiresAt: coupon.expiresAt?.slice(0, 10) ?? "",
            usageLimit: coupon.usageLimit?.toString() ?? "",
          }
        : blank,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, coupon]);

  const set = (k: keyof typeof blank, v: any) => setF((p) => ({ ...p, [k]: v }));
  const toggleId = (k: "productIds" | "categoryIds", id: string) =>
    setF((p) => ({
      ...p,
      [k]: p[k].includes(id) ? p[k].filter((x) => x !== id) : [...p[k], id],
    }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiRequest(coupon ? `/coupons/${coupon.id}` : "/coupons", {
        method: coupon ? "PATCH" : "POST",
        body: JSON.stringify({
          code: f.code,
          description: f.description || null,
          type: f.type,
          value: Number(f.value),
          maxDiscountAmount: f.maxDiscountAmount || null,
          minPurchaseAmount: f.minPurchaseAmount || null,
          scope: f.scope,
          productIds: f.productIds,
          categoryIds: f.categoryIds,
          startsAt: f.startsAt ? new Date(f.startsAt + "T00:00:00").toISOString() : null,
          expiresAt: f.expiresAt ? new Date(f.expiresAt + "T23:59:59").toISOString() : null,
          usageLimit: f.usageLimit || null,
          isActive: coupon ? coupon.isActive : true,
        }),
      });
      onSaved(coupon ? "Coupon updated" : "Coupon created");
    } catch (err: any) {
      setError(err.message || "Failed to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const generate = () =>
    set("code", Math.random().toString(36).slice(2, 10).toUpperCase());

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {coupon ? "Edit coupon" : "New coupon"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="c-code" className="text-sm">Code *</Label>
            <div className="flex gap-2">
              <Input
                id="c-code"
                value={f.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                placeholder="WELCOME10"
                className="h-10 font-mono"
              />
              <Button type="button" variant="outline" onClick={generate} className="h-10 shrink-0">
                Generate
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="c-desc" className="text-sm">Description (optional)</Label>
            <Input id="c-desc" value={f.description} onChange={(e) => set("description", e.target.value)} className="h-10" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm">Type *</Label>
              <div className="flex gap-1 rounded-lg border border-zinc-200 p-1 dark:border-zinc-700">
                {(["PERCENTAGE", "FIXED_AMOUNT"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("type", t)}
                    className={`flex-1 rounded-md py-2 text-xs font-semibold ${f.type === t ? "bg-orange-500 text-white" : "text-zinc-500"}`}
                  >
                    {t === "PERCENTAGE" ? "Percentage" : "Fixed amount"}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-value" className="text-sm">
                {f.type === "PERCENTAGE" ? "Percent off *" : "Amount off (GHS) *"}
              </Label>
              <Input id="c-value" type="number" min="0" step="0.01" value={f.value} onChange={(e) => set("value", e.target.value)} className="h-10" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {f.type === "PERCENTAGE" && (
              <div className="space-y-1.5">
                <Label htmlFor="c-max" className="text-sm">Max discount (GHS)</Label>
                <Input id="c-max" type="number" min="0" step="0.01" value={f.maxDiscountAmount} onChange={(e) => set("maxDiscountAmount", e.target.value)} placeholder="No cap" className="h-10" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="c-min" className="text-sm">Minimum purchase (GHS)</Label>
              <Input id="c-min" type="number" min="0" step="0.01" value={f.minPurchaseAmount} onChange={(e) => set("minPurchaseAmount", e.target.value)} placeholder="None" className="h-10" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm">Applies to</Label>
            <div className="flex gap-1 rounded-lg border border-zinc-200 p-1 dark:border-zinc-700">
              {([["CART", "Whole basket"], ["CATEGORY", "Categories"], ["PRODUCT", "Products"]] as const).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set("scope", v)}
                  className={`flex-1 rounded-md py-2 text-xs font-semibold ${f.scope === v ? "bg-orange-500 text-white" : "text-zinc-500"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {f.scope !== "CART" && (
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-zinc-200 p-2 dark:border-zinc-800">
                {(f.scope === "CATEGORY" ? categories : products).map((item: any) => {
                  const key = f.scope === "CATEGORY" ? "categoryIds" : "productIds";
                  return (
                    <label key={item.id} className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900">
                      <input
                        type="checkbox"
                        checked={f[key].includes(item.id)}
                        onChange={() => toggleId(key, item.id)}
                        className="h-4 w-4 accent-orange-500"
                      />
                      <span className="truncate">{item.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="c-start" className="text-sm">Starts</Label>
              <Input id="c-start" type="date" value={f.startsAt} onChange={(e) => set("startsAt", e.target.value)} className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-end" className="text-sm">Ends</Label>
              <Input id="c-end" type="date" value={f.expiresAt} onChange={(e) => set("expiresAt", e.target.value)} className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-limit" className="text-sm">Max uses</Label>
              <Input id="c-limit" type="number" min="1" step="1" value={f.usageLimit} onChange={(e) => set("usageLimit", e.target.value)} placeholder="Unlimited" className="h-10" />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-black hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {coupon ? "Save changes" : "Create coupon"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}