import { Product } from "@/types";

/** What gets encoded inside every product QR code. Uses the product id, so
 *  the QR keeps working when you change the price, name or category. */
export const QR_PREFIX = "storeroom:product:";
export const qrPayload = (productId: string) => `${QR_PREFIX}${productId}`;

export const CHANNEL_STORAGE_KEY = "posScanChannel";
export const newChannel = () =>
  crypto.randomUUID().replace(/-/g, "").slice(0, 10);

/** Turns whatever the camera read into a product. Handles our QR codes AND
 *  normal barcodes (matched against the product's `barcode` field). */
export function resolveScan(raw: string, products: Product[]) {
  const code = raw.trim();
  if (code.startsWith(QR_PREFIX)) {
    const id = code.slice(QR_PREFIX.length);
    return products.find((p) => p.id === id);
  }
  return products.find((p) => p.barcode && p.barcode === code);
}

/** Short beep + vibration so the cashier knows a scan registered without looking. */
export function beep(kind: "ok" | "error" = "ok") {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = kind === "ok" ? 880 : 220;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + (kind === "ok" ? 0.08 : 0.25));
    osc.onended = () => ctx.close();
    navigator.vibrate?.(kind === "ok" ? 40 : [80, 40, 80]);
  } catch {
    /* audio/vibration are best-effort */
  }
}