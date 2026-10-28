"use client";

import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X } from "lucide-react";
import { CHANNEL_STORAGE_KEY, newChannel } from "@/lib/scan";

interface PairPhoneModalProps {
  open: boolean;
  onClose: () => void;
  channel: string | null;
  onChannelChange: (channel: string) => void;
  /** true while this POS screen is listening for scans */
  connected: boolean;
}

export default function PairPhoneModal({
  open,
  onClose,
  channel,
  onChannelChange,
  connected,
}: PairPhoneModalProps) {
  // First time opened: create a pairing code for this POS screen
  useEffect(() => {
    if (open && !channel) {
      const c = newChannel();
      localStorage.setItem(CHANNEL_STORAGE_KEY, c);
      onChannelChange(c);
    }
  }, [open, channel, onChannelChange]);

  const resetCode = () => {
    const c = newChannel();
    localStorage.setItem(CHANNEL_STORAGE_KEY, c);
    onChannelChange(c);
  };

  if (!open) return null;
  const pairUrl = channel ? `${window.location.origin}/scan?c=${channel}` : "";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-zinc-950">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Use your phone as a scanner</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-500">
          Scan this code with your phone&apos;s camera. It opens the scanner
          page (you need to be logged in on the phone). Anything you scan there
          lands in this cart.
        </p>

        <div className="my-4 flex justify-center rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800">
          {pairUrl && <QRCodeSVG value={pairUrl} size={180} marginSize={1} />}
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              connected
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-amber-500"}`}
            />
            {connected ? "Ready to receive scans" : "Connecting..."}
          </span>
          <button
            onClick={resetCode}
            className="text-xs text-zinc-500 underline hover:text-orange-500"
          >
            Make a new code
          </button>
        </div>
        <p className="mt-2 text-[11px] text-zinc-400">
          Making a new code disconnects phones paired with the old one.
        </p>
      </div>
    </div>
  );
}