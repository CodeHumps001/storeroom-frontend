"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

type Voucher = {
  shopName: string;
  offer: string;
  description: string | null;
  minPurchaseAmount: number | null;
  code: string;
  qrValue: string;
  expiresAt: string | null;
  status: "ACTIVE" | "USED" | "EXPIRED" | "DISABLED" | "NOT_STARTED";
};

const STATUS_TEXT: Record<Voucher["status"], string> = {
  ACTIVE: "",
  USED: "This voucher has already been used.",
  EXPIRED: "This voucher has expired.",
  DISABLED: "This offer is no longer available.",
  NOT_STARTED: "This offer hasn't started yet.",
};

/**
 * PUBLIC page (no login). Customers open it from the SMS link and show the QR
 * (or read out the code) at the till. Keep /v out of your protected routes.
 */
export default function VoucherPage() {
  const { code } = useParams<{ code: string }>();
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");

  useEffect(() => {
    if (!code) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/vouchers/${encodeURIComponent(code)}`)
      .then(async (res) => {
        if (res.status === 404) return setState("missing");
        if (!res.ok) throw new Error();
        const json = await res.json();
        setVoucher(json.data);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, [code]);

  const active = voucher?.status === "ACTIVE";

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        {state === "loading" && (
          <p className="p-10 text-center text-sm text-zinc-500">Loading your voucher...</p>
        )}
        {state === "missing" && (
          <p className="p-10 text-center text-sm text-zinc-500">
            We couldn&apos;t find this voucher. Check the link in your SMS.
          </p>
        )}
        {state === "error" && (
          <p className="p-10 text-center text-sm text-zinc-500">
            Something went wrong. Please try again in a moment.
          </p>
        )}

        {state === "ready" && voucher && (
          <>
            <div className="bg-orange-500 px-6 py-6 text-center text-white">
              <p className="text-xs font-medium uppercase tracking-widest opacity-90">
                {voucher.shopName}
              </p>
              <p className="mt-2 text-4xl font-black tracking-tight">{voucher.offer}</p>
              {voucher.description && (
                <p className="mt-1 text-sm opacity-90">{voucher.description}</p>
              )}
            </div>

            <div className="space-y-4 px-6 py-6 text-center">
              {active ? (
                <>
                  <div className="mx-auto w-fit rounded-2xl border border-zinc-200 bg-white p-3">
                    <QRCodeSVG value={voucher.qrValue} size={200} level="M" marginSize={1} />
                  </div>
                  <p className="text-xs text-zinc-500">Show this to the cashier at the till</p>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-zinc-400">
                      No smartphone? Read out this code
                    </p>
                    <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-zinc-900 dark:text-zinc-100">
                      {voucher.code}
                    </p>
                  </div>
                </>
              ) : (
                <p className="rounded-xl bg-zinc-100 px-4 py-6 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {STATUS_TEXT[voucher.status]}
                </p>
              )}

              <ul className="space-y-1 text-xs text-zinc-500">
                {voucher.expiresAt && (
                  <li>
                    Valid until{" "}
                    {new Date(voucher.expiresAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </li>
                )}
                {voucher.minPurchaseAmount ? (
                  <li>Minimum spend GHS {voucher.minPurchaseAmount.toFixed(2)}</li>
                ) : null}
                <li>One use only. Not exchangeable for cash.</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  );
}