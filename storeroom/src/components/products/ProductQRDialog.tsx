"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer } from "lucide-react";
import { Product } from "@/types";
import { qrPayload } from "@/lib/scan";

interface ProductQRDialogProps {
  open: boolean;
  onClose: () => void;
  /** Pass one product for a single label, or the whole list to print many. */
  products: Product[];
}

export default function ProductQRDialog({
  open,
  onClose,
  products,
}: ProductQRDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [printError, setPrintError] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);

  // Small lists start fully selected; big catalogs start empty
  useEffect(() => {
    if (open) {
      setSelected(
        new Set(products.length <= 24 ? products.map((p) => p.id) : []),
      );
      setSearch("");
      setPrintError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const visible = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [products, search],
  );
  const chosen = products.filter((p) => selected.has(p.id));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectVisible = () =>
    setSelected((prev) => new Set([...prev, ...visible.map((p) => p.id)]));

  const handlePrint = () => {
    const html = sheetRef.current?.innerHTML;
    if (!html || chosen.length === 0) return;
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) {
      setPrintError("Your browser blocked the print window. Allow pop-ups for this site and try again.");
      return;
    }
    w.document.write(
      `<!doctype html><html><head><title>Product QR labels</title><style>@page{margin:8mm}body{margin:0;font-family:system-ui,sans-serif}</style></head><body>${html}</body></html>`,
    );
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Print QR labels
          </DialogTitle>
        </DialogHeader>

        {products.length > 1 && (
          <div className="space-y-2">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 text-sm"
            />
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>{chosen.length} selected</span>
              <span className="flex gap-3">
                <button onClick={selectVisible} className="hover:text-orange-500">
                  Select shown
                </button>
                <button
                  onClick={() => setSelected(new Set())}
                  className="hover:text-orange-500"
                >
                  Clear
                </button>
              </span>
            </div>
          </div>
        )}

        <div className="max-h-72 space-y-1 overflow-y-auto">
          {visible.map((p) => (
            <label
              key={p.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 text-sm hover:border-orange-400 dark:border-zinc-800"
            >
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                onChange={() => toggle(p.id)}
                className="h-4 w-4 accent-orange-500"
              />
              <span className="flex-1 truncate">{p.name}</span>
              <QRCodeSVG value={qrPayload(p.id)} size={36} marginSize={0} />
            </label>
          ))}
          {visible.length === 0 && (
            <p className="py-6 text-center text-xs text-zinc-400">
              No products match.
            </p>
          )}
        </div>

        {printError && <p className="text-xs text-red-500">{printError}</p>}

        <Button
          onClick={handlePrint}
          disabled={chosen.length === 0}
          className="w-full bg-black hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print {chosen.length} label{chosen.length === 1 ? "" : "s"}
        </Button>

        {/* Hidden print sheet. Inline styles so it prints correctly in the popup window. */}
        <div ref={sheetRef} style={{ display: "none" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "6mm",
            }}
          >
            {chosen.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #999",
                  borderRadius: 6,
                  padding: "4mm",
                  textAlign: "center",
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                }}
              >
                <QRCodeSVG
                  value={qrPayload(p.id)}
                  size={110}
                  level="M"
                  marginSize={1}
                />
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    marginTop: 4,
                    lineHeight: 1.2,
                  }}
                >
                  {p.name}
                </div>
                {p.barcode && (
                  <div style={{ fontSize: 10, color: "#555" }}>{p.barcode}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}