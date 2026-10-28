"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import apiRequest from "@/lib/api";
import { useProducts } from "@/hooks/useProducts";
import { beep, resolveScan } from "@/lib/scan";
import QRScanner from "@/components/pos/QRScanner";

type Entry = { id: number; ok: boolean; text: string };

/**
 * Phone scanner page. Opened by scanning the pairing QR on the POS screen
 * (URL looks like /scan?c=abc123). Each scan is sent to the paired POS cart.
 * Remember to allow /scan in your auth middleware / route protection.
 */
export default function PhoneScannerPage() {
  const { products, loading } = useProducts();
  const productsRef = useRef(products);
  productsRef.current = products;

  // undefined = not read yet, null = missing from URL
  const [channel, setChannel] = useState<string | null | undefined>(undefined);
  const [log, setLog] = useState<Entry[]>([]);

  useEffect(() => {
    setChannel(new URLSearchParams(window.location.search).get("c"));
  }, []);

  const addLog = (ok: boolean, text: string) =>
    setLog((prev) =>
      [{ id: Date.now() + Math.random(), ok, text }, ...prev].slice(0, 6),
    );

  const handleScan = async (raw: string) => {
    if (!channel) return;
    const product = resolveScan(raw, productsRef.current);
    if (!product) {
      beep("error");
      addLog(false, "Unknown code. It isn't one of your products.");
      return;
    }
    try {
      const res = await apiRequest("/scan/push", {
        method: "POST",
        body: JSON.stringify({ channel, value: raw }),
      });
      if (res.data.delivered === 0) {
        beep("error");
        addLog(
          false,
          "POS screen isn't connected. Reopen Pair phone on the POS.",
        );
        return;
      }
      beep("ok");
      addLog(true, `Sent: ${product.name}`);
    } catch (e: any) {
      beep("error");
      addLog(false, e.message || "Could not send scan");
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col gap-4 bg-zinc-50 p-4 dark:bg-zinc-900">
      <header>
        <h1 className="text-base font-semibold">Phone scanner</h1>
        <p className="text-xs text-zinc-500">
          Scanned items are added to the POS cart you paired with.
        </p>
      </header>

      {channel === null ? (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          This page needs a pairing code. On the POS screen, tap Pair phone and
          scan the code shown there.
        </p>
      ) : channel === undefined || loading ? (
        <p className="py-10 text-center text-sm text-zinc-500">Loading...</p>
      ) : (
        <QRScanner onScan={handleScan} />
      )}

      <ul className="space-y-2">
        {log.map((e) => (
          <li
            key={e.id}
            className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${
              e.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200"
            }`}
          >
            {e.ok ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            {e.text}
          </li>
        ))}
      </ul>
    </div>
  );
}