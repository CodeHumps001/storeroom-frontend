"use client";

import QRScanner from "@/components/pos/QRScanner";
import { X } from "lucide-react";


interface ScanModalProps {
  open: boolean;
  onClose: () => void;
  onScan: (value: string) => void;
}

/** Uses this device's own camera. Stays open so the cashier can scan item after item. */
export default function ScanModal({ open, onClose, onScan }: ScanModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-2xl bg-white p-4 shadow-xl dark:bg-zinc-950 sm:rounded-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Scan products</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <QRScanner onScan={onScan} />

        <p className="mt-3 text-center text-xs text-zinc-500">
          Point the camera at a product QR code or barcode. Each scan adds one
          to the cart.
        </p>
        <button
          onClick={onClose}
          className="mt-3 w-full rounded-xl bg-black py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500 dark:hover:text-white"
        >
          Done
        </button>
      </div>
    </div>
  );
}