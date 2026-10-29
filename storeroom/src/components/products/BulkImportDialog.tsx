"use client";

import { useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Loader2,
  Upload,
} from "lucide-react";
import apiRequest from "@/lib/api";
import { useCategories } from "@/hooks/useCategories";
import { Product } from "@/types";

interface BulkImportDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  products: Product[];
}

type ImportRow = {
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
};
type Issue = { line: number; name: string; reason: string };
type Result = {
  created: number;
  categoriesCreated: number;
  skipped: { index: number; name: string | null; reason: string }[];
  failed: { index: number; name: string | null; reason: string }[];
};

const COLUMNS = ["name", "category", "costPrice", "sellingPrice", "quantity"];
const MAX_ROWS = 1000; // keep in sync with the backend

export default function BulkImportDialog({
  open,
  onClose,
  onSuccess,
  products,
}: BulkImportDialogProps) {
  const { categories } = useCategories();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rawRows, setRawRows] = useState<Record<string, string>[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const [createCategories, setCreateCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const reset = () => {
    setRawRows(null);
    setFileName("");
    setParseError("");
    setSubmitError("");
    setResult(null);
    setCreateCategories(true);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const downloadTemplate = () => {
    const csv = Papa.unparse({
      fields: COLUMNS,
      data: [
        { name: "Sample Rice 5kg", category: "Groceries", costPrice: 55, sellingPrice: 70, quantity: 20 },
        { name: "Sample Soap", category: "Toiletries", costPrice: 3.5, sellingPrice: 5, quantity: 100 },
      ],
    });
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-import-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFile = (file: File) => {
    reset();
    setFileName(file.name);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) =>
        COLUMNS.find((c) => c.toLowerCase() === h.trim().toLowerCase()) ??
        h.trim(),
      complete: ({ data, meta }) => {
        const fields = meta.fields ?? [];
        const missing = ["name", "category", "costPrice", "sellingPrice"].filter(
          (f) => !fields.includes(f),
        );
        if (missing.length) {
          setParseError(
            `Missing column(s): ${missing.join(", ")}. Download the template to see the right format.`,
          );
          return;
        }
        setRawRows(data);
      },
      error: (err) => setParseError(err.message),
    });
  };

  // Recomputed whenever the file or the "create categories" switch changes
  const analysis = useMemo(() => {
    if (!rawRows) return null;

    const existingNames = new Set(products.map((p) => p.name.trim().toLowerCase()));
    const knownCategories = new Set(categories.map((c) => c.name.trim().toLowerCase()));
    const ready: ImportRow[] = [];
    const skipped: Issue[] = [];
    const problems: Issue[] = [];
    const newCategories = new Map<string, string>();
    const seen = new Set<string>();
    let belowCost = 0;

    rawRows.forEach((row, i) => {
      const line = i + 2; // line 1 is the header
      const name = (row.name ?? "").trim();
      const category = (row.category ?? "").trim();
      const bad = (reason: string) => problems.push({ line, name: name || `row ${line}`, reason });
      const num = (v: unknown) => (String(v ?? "").trim() === "" ? NaN : Number(v));

      if (!name) return bad("Name is required");
      if (!category) return bad("Category is required");

      const costPrice = num(row.costPrice);
      const sellingPrice = num(row.sellingPrice);
      const rawQty = String(row.quantity ?? "").trim();
      const quantity = rawQty === "" ? 0 : Number(rawQty);

      if (!Number.isFinite(costPrice) || costPrice < 0) return bad(`Invalid cost price "${row.costPrice ?? ""}"`);
      if (!Number.isFinite(sellingPrice) || sellingPrice < 0) return bad(`Invalid selling price "${row.sellingPrice ?? ""}"`);
      if (!Number.isInteger(quantity) || quantity < 0) return bad(`Invalid quantity "${rawQty}"`);

      const key = name.toLowerCase();
      if (existingNames.has(key)) {
        skipped.push({ line, name, reason: "Already exists" });
        return;
      }
      if (seen.has(key)) {
        skipped.push({ line, name, reason: "Duplicate in file" });
        return;
      }
      const catKey = category.toLowerCase();
      if (!knownCategories.has(catKey)) {
        if (!createCategories) return bad(`Unknown category "${category}"`);
        if (!newCategories.has(catKey)) newCategories.set(catKey, category);
      }

      seen.add(key);
      if (sellingPrice < costPrice) belowCost++;
      ready.push({ name, category, costPrice, sellingPrice, quantity });
    });

    return { ready, skipped, problems, newCategories: [...newCategories.values()], belowCost };
  }, [rawRows, products, categories, createCategories]);

  const apply = async () => {
    if (!analysis) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await apiRequest("/products/bulk-import", {
        method: "POST",
        body: JSON.stringify({
          products: analysis.ready,
          createMissingCategories: createCategories,
        }),
      });
      setResult(res.data);
      setRawRows(null);
      onSuccess();
    } catch (e: any) {
      setSubmitError(e.message || "Import failed");
    } finally {
      setSubmitting(false);
    }
  };

  const tooMany = (analysis?.ready.length ?? 0) > MAX_ROWS;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Import products</DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              {result.created} product{result.created === 1 ? "" : "s"} imported
              {result.categoriesCreated > 0 &&
                ` · ${result.categoriesCreated} new categor${result.categoriesCreated === 1 ? "y" : "ies"}`}
            </div>
            {(result.skipped.length > 0 || result.failed.length > 0) && (
              <div className="max-h-40 overflow-y-auto rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                <p className="mb-1 font-semibold">Not imported:</p>
                {[...result.skipped, ...result.failed].map((r, i) => (
                  <p key={i}>
                    Row {r.index + 2} ({r.name ?? "no name"}): {r.reason}
                  </p>
                ))}
              </div>
            )}
            <p className="text-xs text-zinc-500">
              Each new product got a barcode automatically. Use Print QR labels
              to print them.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div>
                <p className="text-sm font-semibold">1. Get the template</p>
                <p className="text-xs text-zinc-500">
                  Fill in one product per row: name, category, cost price,
                  selling price and quantity.
                </p>
              </div>
              <Button variant="outline" onClick={downloadTemplate} className="shrink-0">
                <Download className="mr-2 h-4 w-4" />
                Template
              </Button>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="min-w-0">
                <p className="text-sm font-semibold">2. Upload your file</p>
                <p className="truncate text-xs text-zinc-500">
                  {fileName || "Existing products are skipped, never overwritten."}
                </p>
              </div>
              <label className="inline-flex shrink-0 cursor-pointer items-center rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium hover:border-orange-500 dark:border-zinc-700">
                <Upload className="mr-2 h-4 w-4" />
                Choose CSV
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </label>
            </div>

            {parseError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {parseError}
              </p>
            )}

            {analysis && (
              <div className="space-y-3">
                <p className="text-sm font-semibold">3. Review</p>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                    {analysis.ready.length} to import
                  </span>
                  {analysis.skipped.length > 0 && (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {analysis.skipped.length} skipped
                    </span>
                  )}
                  {analysis.problems.length > 0 && (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
                      {analysis.problems.length} with problems
                    </span>
                  )}
                </div>

                <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <input
                    type="checkbox"
                    checked={createCategories}
                    onChange={(e) => setCreateCategories(e.target.checked)}
                    className="h-4 w-4 accent-orange-500"
                  />
                  Create categories that don&apos;t exist yet
                  {analysis.newCategories.length > 0 &&
                    ` (${analysis.newCategories.slice(0, 4).join(", ")}${analysis.newCategories.length > 4 ? "…" : ""})`}
                </label>

                {analysis.ready.length > 0 && (
                  <div className="max-h-56 divide-y divide-zinc-100 overflow-y-auto rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
                    {analysis.ready.slice(0, 100).map((r) => (
                      <div key={r.name} className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{r.name}</p>
                          <p className="text-zinc-500">{r.category}</p>
                        </div>
                        <p className="shrink-0 text-right text-zinc-500">
                          Cost {r.costPrice.toFixed(2)} · Sell {r.sellingPrice.toFixed(2)} · Qty {r.quantity}
                        </p>
                      </div>
                    ))}
                    {analysis.ready.length > 100 && (
                      <p className="px-3 py-2 text-center text-xs text-zinc-400">
                        …and {analysis.ready.length - 100} more
                      </p>
                    )}
                  </div>
                )}

                {(analysis.problems.length > 0 || analysis.skipped.length > 0) && (
                  <div className="max-h-32 overflow-y-auto rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-300">
                    <p className="mb-1 font-semibold">These rows won&apos;t be imported:</p>
                    {[...analysis.problems, ...analysis.skipped].map((it, i) => (
                      <p key={i}>
                        Row {it.line} ({it.name}): {it.reason}
                      </p>
                    ))}
                  </div>
                )}

                {analysis.belowCost > 0 && (
                  <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {analysis.belowCost} product{analysis.belowCost === 1 ? " sells" : "s sell"} below cost price. Check the prices if that&apos;s not intended.
                  </p>
                )}
                {tooMany && (
                  <p className="text-xs text-red-500">
                    Too many rows. Import up to {MAX_ROWS} products per file.
                  </p>
                )}
                {submitError && <p className="text-xs text-red-500">{submitError}</p>}

                <Button
                  onClick={apply}
                  disabled={submitting || analysis.ready.length === 0 || tooMany}
                  className="w-full bg-black hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    `Import ${analysis.ready.length} product${analysis.ready.length === 1 ? "" : "s"}`
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}