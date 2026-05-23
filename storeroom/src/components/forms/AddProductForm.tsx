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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import apiRequest from "@/lib/api";
import { Loader2, Upload, X } from "lucide-react";
import { Product } from "@/types";

interface AddProductFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product; // add this
}

interface FormData {
  name: string;
  categoryId: string;
  barcode: string;
  costPrice: string;
  sellingPrice: string;
  quantity: string;
  image: File | null;
}

export default function AddProductForm({
  open,
  onClose,
  onSuccess,
  product,
}: AddProductFormProps) {
  const {
    categories,
    loading: categoriesLoading,
    fetchCategory,
  } = useCategories();
  const [formData, setFormData] = useState<FormData>({
    name: product?.name || "",
    categoryId: product?.categoryId || "",
    barcode: product?.barcode || "",
    costPrice: product?.costPrice?.toString() || "",
    sellingPrice: product?.sellingPrice?.toString() || "",
    quantity: product?.quantity?.toString() || "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Fetch categories when dialog opens

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        categoryId: product.categoryId || "",
        barcode: product.barcode || "",
        costPrice: product.costPrice.toString(),
        sellingPrice: product.sellingPrice.toString(),
        quantity: product.quantity.toString(),
        image: null,
      });
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setFormData({
      name: "",
      categoryId: "",
      barcode: "",
      costPrice: "",
      sellingPrice: "",
      quantity: "",
      image: null,
    });
    setImagePreview("");
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
    if (errors.categoryId) {
      setErrors((prev) => ({ ...prev, categoryId: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview("");
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }
    if (!formData.costPrice) {
      newErrors.costPrice = "Cost price is required";
    } else if (
      isNaN(Number(formData.costPrice)) ||
      Number(formData.costPrice) < 0
    ) {
      newErrors.costPrice = "Enter a valid cost price";
    }
    if (!formData.sellingPrice) {
      newErrors.sellingPrice = "Selling price is required";
    } else if (
      isNaN(Number(formData.sellingPrice)) ||
      Number(formData.sellingPrice) < 0
    ) {
      newErrors.sellingPrice = "Enter a valid selling price";
    }
    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (
      isNaN(Number(formData.quantity)) ||
      Number(formData.quantity) < 0
    ) {
      newErrors.quantity = "Enter a valid quantity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create form data for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("categoryId", formData.categoryId);
      submitData.append("barcode", formData.barcode);
      submitData.append("costPrice", formData.costPrice);
      submitData.append("sellingPrice", formData.sellingPrice);
      submitData.append("quantity", formData.quantity);
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const isEditing = !!product;

      await apiRequest(isEditing ? `/products/${product!.id}` : "/products", {
        method: isEditing ? "PATCH" : "POST",
        body: submitData,
        headers: {},
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrors({ name: err.message || "Failed to add product" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Product Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleInputChange}
              className="h-10"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-sm font-medium">
              Category *
            </Label>
            <Select
              value={formData.categoryId}
              onValueChange={handleSelectChange}
              disabled={categoriesLoading}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading categories...
                  </SelectItem>
                ) : categories.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No categories found
                  </SelectItem>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-red-500">{errors.categoryId}</p>
            )}
          </div>

          {/* Barcode */}
          <div className="space-y-2">
            <Label htmlFor="barcode" className="text-sm font-medium">
              Barcode (Optional)
            </Label>
            <Input
              id="barcode"
              type="text"
              placeholder="Enter barcode"
              value={formData.barcode}
              onChange={handleInputChange}
              className="h-10"
            />
          </div>

          {/* Cost Price & Selling Price */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="costPrice" className="text-sm font-medium">
                Cost Price *
              </Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.costPrice}
                onChange={handleInputChange}
                className="h-10"
              />
              {errors.costPrice && (
                <p className="text-xs text-red-500">{errors.costPrice}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice" className="text-sm font-medium">
                Selling Price *
              </Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                className="h-10"
              />
              {errors.sellingPrice && (
                <p className="text-xs text-red-500">{errors.sellingPrice}</p>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium">
              Quantity *
            </Label>
            <Input
              id="quantity"
              type="number"
              step="1"
              placeholder="0"
              value={formData.quantity}
              onChange={handleInputChange}
              className="h-10"
            />
            {errors.quantity && (
              <p className="text-xs text-red-500">{errors.quantity}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium">
              Product Image (Optional)
            </Label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-24 w-24 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 hover:border-orange-500 dark:border-zinc-700">
                  <Upload className="h-6 w-6 text-zinc-400" />
                  <span className="text-xs text-zinc-500">Upload</span>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
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
              className="flex-1 bg-black hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {product ? "Saving..." : "Adding..."}
                </>
              ) : product ? (
                "Save Changes"
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
