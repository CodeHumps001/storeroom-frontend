"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Link2, Loader2, RefreshCw, Send, Trash2 } from "lucide-react";
import apiRequest from "@/lib/api";

type CouponRef = { id: string; code: string; type: "PERCENTAGE" | "FIXED_AMOUNT"; value: number };

type Issued = {
  id: string;
  code: string;
  phone: string;
  customerName: string | null;
  link: string;
  smsSent: boolean;
  smsError: string | null;
};
type IssueResult = {
  created: number;
  smsSent: number;
  smsFailed: number;
  smsSegmentsEach: number;
  invalid: { phone: string; reason: string }[];
  items: Issued[];
};

const copy = (text: string) => navigator.clipboard?.writeText(text).catch(() => {});

// ── Send vouchers dialog ─────────────────────────────────────────────────────
export function SendVouchersDialog({
  coupon,
  onClose,
  onDone,
}: {
  coupon: CouponRef | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const [text, setText] = useState("");
  const [days, setDays] = useState("14");
  const [sendSms, setSendSms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<IssueResult | null>(null);

  useEffect(() => {
    if (coupon) {
      setText("");
      setDays("14");
      setSendSms(true);
      setError("");
      setResult(null);
    }
  }, [coupon]);

  // One customer per line: "024 123 4567" or "024 123 4567, Kofi"
  const recipients = useMemo(
    () =>
      text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [phone, ...rest] = l.split(/[,\t;]/);
          return { phone: phone.trim(), name: rest.join(" ").trim() || undefined };
        }),
    [text],
  );

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest("/vouchers/issue", {
        method: "POST",
        body: JSON.stringify({
          couponId: coupon!.id,
          recipients,
          validDays: Number(days),
          sendSms,
        }),
      });
      setResult(res.data);
      onDone();
    } catch (e: any) {
      setError(e.message || "Could not create vouchers");
    } finally {
      setLoading(false);
    }
  };

  const offer = coupon
    ? coupon.type === "PERCENTAGE"
      ? `${coupon.value}% off`
      : `GHS ${coupon.value} off`
    : "";

  return (
    <Dialog open={!!coupon} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Send vouchers · {coupon?.code}
          </DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              {result.created} voucher{result.created === 1 ? "" : "s"} created
              {sendSms && ` · ${result.smsSent} SMS sent`}
              {result.smsFailed > 0 && ` · ${result.smsFailed} failed`}
            </div>

            {result.invalid.length > 0 && (
              <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                <p className="mb-1 font-semibold">Not created:</p>
                {result.invalid.map((r, i) => (
                  <p key={i}>
                    {r.phone || "(empty)"}: {r.reason}
                  </p>
                ))}
              </div>
            )}

            <div className="max-h-64 divide-y divide-zinc-100 overflow-y-auto rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              {result.items.map((i) => (
                <div key={i.id} className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {i.phone}
                      {i.customerName ? ` · ${i.customerName}` : ""}
                    </p>
                    <p className={i.smsError ? "text-red-500" : "text-zinc-500"}>
                      <span className="font-mono">{i.code}</span>
                      {sendSms && (i.smsSent ? " · SMS sent" : ` · ${i.smsError ?? "not sent"}`)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 shrink-0 px-2" onClick={() => copy(i.link)}>
                    <Link2 className="mr-1 h-3.5 w-3.5" />
                    Copy link
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-zinc-500">
              Each customer gets their own single-use <b>{offer}</b> voucher. They open the
              link in the SMS and show the QR at the till, or read out the code.
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="v-numbers" className="text-sm">
                Phone numbers (one per line, name optional)
              </Label>
              <textarea
                id="v-numbers"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                placeholder={"024 123 4567, Kofi\n055 987 6543, Ama\n020 555 1212"}
                className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-orange-500 focus:outline-none dark:border-zinc-700"
              />
              <p className="text-xs text-zinc-400">
                {recipients.length} number{recipients.length === 1 ? "" : "s"} · up to 100 at a time ·
                one voucher per customer per coupon
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="v-days" className="text-sm">Valid for (days)</Label>
                <Input id="v-days" type="number" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} className="h-10" />
              </div>
              <label className="flex items-end gap-2 pb-2 text-sm">
                <input
                  type="checkbox"
                  checked={sendSms}
                  onChange={(e) => setSendSms(e.target.checked)}
                  className="h-4 w-4 accent-orange-500"
                />
                Send SMS now
              </label>
            </div>
            <p className="text-xs text-zinc-500">
              {sendSms
                ? "Each SMS is charged by your SMS provider (usually 1 unit per voucher)."
                : "Vouchers will be created without sending. Copy each link and share it yourself."}
            </p>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={submit}
                disabled={loading || recipients.length === 0}
                className="flex-1 bg-black hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {sendSms ? `Send ${recipients.length}` : `Create ${recipients.length}`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Issued vouchers list ─────────────────────────────────────────────────────
type VoucherRow = {
  id: string;
  code: string;
  phone: string | null;
  customerName: string | null;
  campaign: string;
  offer: string;
  status: "ACTIVE" | "USED" | "EXPIRED" | "DISABLED" | "NOT_STARTED";
  expiresAt: string | null;
  smsSentAt: string | null;
  smsError: string | null;
  link: string;
};

const BADGE: Record<VoucherRow["status"], string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  USED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  EXPIRED: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  DISABLED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  NOT_STARTED: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
};

export function IssuedVouchers({
  refreshKey,
  onMessage,
}: {
  refreshKey: number;
  onMessage: (type: "success" | "error", message: string) => void;
}) {
  const [rows, setRows] = useState<VoucherRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await apiRequest("/vouchers");
      setRows(res.data);
    } catch (e: any) {
      onMessage("error", e.message || "Failed to load vouchers");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const resend = async (v: VoucherRow) => {
    setBusyId(v.id);
    try {
      await apiRequest(`/vouchers/${v.id}/resend`, { method: "POST" });
      onMessage("success", "SMS sent");
      load();
    } catch (e: any) {
      onMessage("error", e.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (v: VoucherRow) => {
    if (!window.confirm(`Remove voucher ${v.code}? The customer will no longer be able to use it.`)) return;
    setBusyId(v.id);
    try {
      await apiRequest(`/vouchers/${v.id}`, { method: "DELETE" });
      load();
    } catch (e: any) {
      onMessage("error", e.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Issued vouchers</CardTitle>
        <Button variant="ghost" size="sm" onClick={load} className="h-8 px-2 text-xs">
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <p className="py-10 text-center text-sm text-zinc-400">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-400">
            No vouchers yet. Use Send on a coupon above to create some.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.map((v) => (
              <div key={v.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {v.phone ?? "No phone"}
                    {v.customerName ? ` · ${v.customerName}` : ""}
                  </p>
                  <p className="text-xs text-zinc-500">
                    <span className="font-mono">{v.code}</span> · {v.campaign} ({v.offer})
                    {v.expiresAt ? ` · until ${new Date(v.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""}
                  </p>
                  {v.smsError && <p className="text-xs text-red-500">SMS failed: {v.smsError}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE[v.status]}`}>
                    {v.status === "NOT_STARTED" ? "Not started" : v.status.charAt(0) + v.status.slice(1).toLowerCase()}
                  </span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Copy link" onClick={() => copy(v.link)}>
                    <Link2 className="h-4 w-4" />
                  </Button>
                  {v.status === "ACTIVE" && v.phone && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Resend SMS" disabled={busyId === v.id} onClick={() => resend(v)}>
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                  {v.status !== "USED" && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-red-600" title="Remove" disabled={busyId === v.id} onClick={() => remove(v)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}