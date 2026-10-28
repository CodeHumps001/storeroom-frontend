"use client";

import { useRef, useState } from "react";
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

interface BulkUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  products: Product[];
}

type Update = {
  id: string;
  name?: string;
  categoryId?: string;
  costPrice?: number;
  sellingPrice?: number;
  quantity?: number;
};
type Change = { field: string; from: string; to: string };
type PreviewRow = { line: number; name: string; update: Update; changes: Change[] };
type Issue = { line: number; label: string; error: string };
type Analysis = {
  preview: PreviewRow[];
  issues: Issue[];
  unchanged: number;
};
type Result = {
  updated: number;
  failed: { index: number; id: string | null; error: string }[];
};

const COLUMNS = [
  "id",
  "name",
  "category",
  "barcode",
  "costPrice",
  "sellingPrice",
  "quantity",
];
const MAX_ROWS = 1000; // keep in sync with the backend

export default function BulkUpdateDialog({
  open,
  onClose,
  onSuccess,
  products,
}: BulkUpdateDialogProps) {
  const { categories } = useCategories();
  const fileRef = useRef<HTMLInputElement>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const reset = () => {
    setAnalysis(null);
    setFileName("");
    setParseError("");
    setSubmitError("");
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // ── Export current products as an editable CSV ────────────────────────────
  const exportCsv = () => {
    const data = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category?.name ?? "",
      barcode: p.barcode ?? "",
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      quantity: p.quantity,
    }));
    const csv = Papa.unparse({ fields: COLUMNS, data });
    // BOM so Excel reads UTF-8 (accents, symbols) correctly
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Read the uploaded CSV and work out what would change ──────────────────
  const analyze = (rows: Record<string, string>[], fields: string[]) => {
    if (!fields.includes("id") && !fields.includes("barcode")) {
      setParseError(
        "This file has no id column. Use Export CSV to get a file in the right format.",
      );
      return;
    }

    const byId = new Map(products.map((p) => [p.id, p]));
    const byBarcode = new Map(
      products.filter((p) => p.barcode).map((p) => [p.barcode as string, p]),
    );
    const catByName = new Map(
      categories.map((c) => [c.name.trim().toLowerCase(), c]),
    );

    const preview: PreviewRow[] = [];
    const issues: Issue[] = [];
    const seen = new Set<string>();
    let unchanged = 0;

    rows.forEach((row, i) => {
      const line = i + 2; // line 1 is the header
      const idCell = (row.id ?? "").trim();
      const barcodeCell = (row.barcode ?? "").trim();
      const product =
        (idCell ? byId.get(idCell) : undefined) ??
        (barcodeCell ? byBarcode.get(barcodeCell) : undefined);
      const label = (row.name ?? "").trim() || idCell || `row ${line}`;

      if (!product) {
        issues.push({ line, label, error: "No matching product" });
        return;
      }
      if (seen.has(product.id)) {
        issues.push({ line, label: product.name, error: "Appears more than once" });
        return;
      }
      seen.add(product.id);

      const update: Update = { id: product.id };
      const changes: Change[] = [];
      let rowError = "";

      const name = (row.name ?? "").trim();
      if (name && name !== product.name) {
        update.name = name;
        changes.push({ field: "Name", from: product.name, to: name });
      }

      const catName = (row.category ?? "").trim();
      if (
        catName &&
        catName.toLowerCase() !== (product.category?.name ?? "").trim().toLowerCase()
      ) {
        const cat = catByName.get(catName.toLowerCase());
        if (!cat) rowError = `Unknown category "${catName}"`;
        else {
          update.categoryId = cat.id;
          changes.push({
            field: "Category",
            from: product.category?.name ?? "-",
            to: cat.name,
          });
        }
      }

      const num = (
        key: "costPrice" | "sellingPrice" | "quantity",
        label: string,
        integer: boolean,
      ) => {
        const raw = String(row[key] ?? "").trim();
        if (raw === "") return; // blank cell = leave as is
        const n = Number(raw);
        if (!Number.isFinite(n) || n < 0 || (integer && !Number.isInteger(n))) {
          rowError = rowError || `Invalid ${label.toLowerCase()} "${raw}"`;
          return;
        }
        if (n !== product[key]) {
          update[key] = n;
          changes.push({ field: label, from: String(product[key]), to: String(n) });
        }
      };
      num("costPrice", "Cost price", false);
      num("sellingPrice", "Selling price", false);
      num("quantity", "Quantity", true);

      if (rowError) {
        issues.push({ line, label: product.name, error: rowError });
        return;
      }
      if (changes.length === 0) {
        unchanged++;
        return;
      }
      preview.push({ line, name: product.name, update, changes });
    });

    setAnalysis({ preview, issues, unchanged });
  };

  const handleFile = (file: File) => {
    reset();
    setFileName(file.name);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      // match headers regardless of capitalisation or stray spaces
      transformHeader: (h) =>
        COLUMNS.find((c) => c.toLowerCase() === h.trim().toLowerCase()) ??
        h.trim(),
      complete: ({ data, meta }) => analyze(data, meta.fields ?? []),
      error: (err) => setParseError(err.message),
    });
  };

  // ── Send to the server ────────────────────────────────────────────────────
  const apply = async () => {
    if (!analysis) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await apiRequest("/products/bulk", {
        method: "PATCH",
        body: JSON.stringify({ updates: analysis.preview.map((r) => r.update) }),
      });
      setResult(res.data);
      setAnalysis(null);
      onSuccess();
    } catch (e: any) {
      setSubmitError(e.message || "Bulk update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const tooMany = (analysis?.preview.length ?? 0) > MAX_ROWS;
  const touchesStock = analysis?.preview.some((r) =>
    r.changes.some((c) => c.field === "Quantity"),
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Bulk update products
          </DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              {result.updated} product{result.updated === 1 ? "" : "s"} updated
            </div>
            {result.failed.length > 0 && (
              <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                <p className="mb-1 font-semibold">
                  {result.failed.length} row(s) were skipped:
                </p>
                {result.failed.map((f, i) => (
                  <p key={i}>
                    Row {f.index + 2}: {f.error}
                  </p>
                ))}
              </div>
            )}
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Step 1 */}
            <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div>
                <p className="text-sm font-semibold">1. Export your products</p>
                <p className="text-xs text-zinc-500">
                  Edit name, category, prices or quantity in Excel or Sheets.
                  Don&apos;t change the id column.
                </p>
              </div>
              <Button variant="outline" onClick={exportCsv} className="shrink-0">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>

            {/* Step 2 */}
            <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="min-w-0">
                <p className="text-sm font-semibold">2. Upload the edited file</p>
                <p className="truncate text-xs text-zinc-500">
                  {fileName || "Blank cells are left unchanged."}
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

            {/* Step 3: review */}
            {analysis && (
              <div className="space-y-3">
                <p className="text-sm font-semibold">3. Review the changes</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                    {analysis.preview.length} to update
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {analysis.unchanged} unchanged
                  </span>
                  {analysis.issues.length > 0 && (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
                      {analysis.issues.length} with problems
                    </span>
                  )}
                </div>

                {analysis.preview.length > 0 && (
                  <div className="max-h-64 divide-y divide-zinc-100 overflow-y-auto rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
                    {analysis.preview.map((r) => (
                      <div key={r.update.id} className="px-3 py-2 text-xs">
                        <p className="font-semibold">{r.name}</p>
                        <p className="text-zinc-500">
                          {r.changes
                            .map((c) => `${c.field}: ${c.from} → ${c.to}`)
                            .join("  ·  ")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {analysis.issues.length > 0 && (
                  <div className="max-h-32 overflow-y-auto rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-300">
                    <p className="mb-1 font-semibold">
                      These rows will be skipped:
                    </p>
                    {analysis.issues.map((it, i) => (
                      <p key={i}>
                        Row {it.line} ({it.label}): {it.error}
                      </p>
                    ))}
                  </div>
                )}

                {touchesStock && (
                  <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Quantities in the file replace current stock. If you made
                    sales after exporting, export again first or those sales
                    will be added back to stock.
                  </p>
                )}

                {tooMany && (
                  <p className="text-xs text-red-500">
                    Too many changes at once. Upload up to {MAX_ROWS} changed
                    rows per file.
                  </p>
                )}
                {submitError && (
                  <p className="text-xs text-red-500">{submitError}</p>
                )}

                <Button
                  onClick={apply}
                  disabled={submitting || analysis.preview.length === 0 || tooMany}
                  className="w-full bg-black hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    `Update ${analysis.preview.length} product${analysis.preview.length === 1 ? "" : "s"}`
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