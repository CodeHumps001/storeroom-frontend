"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiRequest from "@/lib/api";
import { Loader2 } from "lucide-react";

interface AddCreditFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCreditForm({
  open,
  onClose,
  onSuccess,
}: AddCreditFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    amount: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setFormData({
        customerName: "",
        customerPhone: "",
        amount: "",
        note: "",
      });
      setErrors({});
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName.trim())
      newErrors.customerName = "Customer name is required";
    if (!formData.amount) newErrors.amount = "Amount is required";
    else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await apiRequest("/credits", {
        method: "POST",
        body: JSON.stringify({
          customerName: formData.customerName.trim(),
          customerPhone: formData.customerPhone.trim() || undefined,
          amount: parseFloat(formData.amount),
          note: formData.note.trim() || undefined,
        }),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrors({ customerName: err.message || "Failed to add credit" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add Credit Entry
          </DialogTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Record a customer debt or credit purchase
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="customerName" className="text-sm font-medium">
              Customer Name *
            </Label>
            <Input
              id="customerName"
              placeholder="e.g. Kofi Mensah"
              value={formData.customerName}
              onChange={handleChange}
              className="h-10"
              autoFocus
            />
            {errors.customerName && (
              <p className="text-xs text-red-500">{errors.customerName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone" className="text-sm font-medium">
              Phone Number <span className="text-zinc-400">(optional)</span>
            </Label>
            <Input
              id="customerPhone"
              type="tel"
              placeholder="+233 XX XXX XXXX"
              value={formData.customerPhone}
              onChange={handleChange}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount Owed (GHS) *
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              className="h-10"
            />
            {errors.amount && (
              <p className="text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-medium">
              Note <span className="text-zinc-400">(optional)</span>
            </Label>
            <Input
              id="note"
              placeholder="e.g. Took 2 bags of rice"
              value={formData.note}
              onChange={handleChange}
              className="h-10"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Credit"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
