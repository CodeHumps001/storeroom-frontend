"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface QRScannerProps {
  onScan: (value: string) => void;
  /** Ignore the same code if it's read again within this many ms. */
  cooldownMs?: number;
}

function friendlyError(err: unknown) {
  const msg = String(err);
  if (/NotAllowed|Permission/i.test(msg))
    return "Camera access is blocked. Allow camera permission for this site in your browser settings, then reopen the scanner.";
  if (/NotFound|no camera|Requested device/i.test(msg))
    return "No camera found on this device.";
  return "Could not start the camera. Close other apps using it and try again.";
}

export default function QRScanner({ onScan, cooldownMs = 2000 }: QRScannerProps) {
  const regionId = "qr-region-" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!window.isSecureContext) {
      setError(
        "Camera scanning needs a secure (https) connection. It works on localhost and on your live site.",
      );
      return;
    }

    let cancelled = false;
    const last = { text: "", at: 0 };

    const scanner = new Html5Qrcode(regionId, {
      verbose: false,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
      ],
    });

    const started = scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          // wide box so long 1D barcodes fit as well as square QR codes
          qrbox: (w, h) => ({
            width: Math.floor(w * 0.8),
            height: Math.floor(Math.min(w, h) * 0.6),
          }),
        },
        (text) => {
          const now = Date.now();
          if (text === last.text && now - last.at < cooldownMs) return;
          last.text = text;
          last.at = now;
          onScanRef.current(text);
        },
        () => {
          /* per-frame "nothing found" noise */
        },
      )
      .catch((err) => {
        if (!cancelled) setError(friendlyError(err));
      });

    // Safe under React strict mode: only stop after start has settled
    return () => {
      cancelled = true;
      started
        .then(() => scanner.stop())
        .then(() => scanner.clear())
        .catch(() => {});
    };
  }, [regionId, cooldownMs]);

  return (
    <div className="w-full">
      <div
        id={regionId}
        className="min-h-[240px] w-full overflow-hidden rounded-xl bg-black"
      />
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}