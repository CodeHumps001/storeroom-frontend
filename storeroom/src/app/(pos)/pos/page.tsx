"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  ShoppingBag,
  Receipt,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiRequest from "@/lib/api";
import { useProducts } from "@/hooks/useProducts";

interface CartItem {
  product: {
    id: string;
    name: string;
    sellingPrice: number;
    category: { name: string };
  };
  quantity: number;
}

type Toast = { type: "success" | "error"; message: string } | null;

export default function POSPage() {
  const router = useRouter();
  const { products, loading: productsLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "mobile_money"
  >("cash");
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [showReceipt, setShowReceipt] = useState<string | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Filter products based on search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate cart totals
  const total = cart.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity,
    0,
  );
  const change = amountPaid >= total ? amountPaid - total : 0;
  const isChargeDisabled = cart.length === 0 || amountPaid < total;

  // Add product to cart
  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Update quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    }
  };

  // Remove item from cart
  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setAmountPaid(0);
  };

  // Handle charge
  const handleCharge = async () => {
    if (isChargeDisabled) return;

    setLoading(true);
    try {
      const saleData = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.sellingPrice,
        })),
        totalAmount: total,
        paymentMethod,
        amountPaid,
        change,
      };

      const response = await apiRequest("/sales", {
        method: "POST",
        body: JSON.stringify(saleData),
      });

      const saleId = response.data.id;
      setShowReceipt(saleId);
      clearCart();
      showToast("success", "Sale completed successfully!");

      // Auto-hide receipt button after 5 seconds
      setTimeout(() => {
        setShowReceipt(null);
      }, 5000);
    } catch (err: any) {
      showToast("error", err.message || "Failed to process sale");
    } finally {
      setLoading(false);
    }
  };

  // Open receipt
  const openReceipt = async (saleId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sales/${saleId}/receipt`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch receipt");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      showToast("error", "Failed to load receipt");
    }
  };

  if (productsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">Loading POS system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-50 dark:bg-black">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 text-red-600" />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-xs font-bold text-white dark:bg-white dark:text-black">
              SR
            </div>
            <span className="text-sm font-semibold">Storeroom POS</span>
          </div>
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Cashier:{" "}
          {typeof window !== "undefined"
            ? localStorage.getItem("userName") || "Staff"
            : "Staff"}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Products */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer border-zinc-200 transition-all hover:border-orange-500 hover:shadow-lg dark:border-zinc-800"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {product.category.name}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      GHS {product.sellingPrice.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-full p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column - Cart */}
        <div className="flex w-full flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:w-96">
          <div className="flex flex-col h-full">
            {/* Cart Header */}
            <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <ShoppingBag className="h-5 w-5" />
                Current Order
              </h2>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingBag className="h-12 w-12 text-zinc-400" />
                  <p className="mt-2 text-sm text-zinc-500">Cart is empty</p>
                  <p className="text-xs text-zinc-400">
                    Click on products to add them
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-zinc-500">
                            {item.product.sellingPrice.toFixed(2)} each
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product.id)}
                          className="h-7 w-7 p-0 text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-semibold text-emerald-600">
                          GHS{" "}
                          {(item.product.sellingPrice * item.quantity).toFixed(
                            2,
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Subtotal
                  </span>
                  <span className="text-sm font-semibold">
                    GHS {total.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-xl font-bold text-emerald-600">
                    GHS {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
              <div className="space-y-4">
                {/* Payment Method */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Payment Method
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={paymentMethod === "cash" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("cash")}
                      className={
                        paymentMethod === "cash"
                          ? "bg-black hover:bg-orange-500"
                          : ""
                      }
                    >
                      <Banknote className="mr-2 h-4 w-4" />
                      Cash
                    </Button>
                    <Button
                      type="button"
                      variant={paymentMethod === "card" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("card")}
                      className={
                        paymentMethod === "card"
                          ? "bg-black hover:bg-orange-500"
                          : ""
                      }
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Card
                    </Button>
                    <Button
                      type="button"
                      variant={
                        paymentMethod === "mobile_money" ? "default" : "outline"
                      }
                      onClick={() => setPaymentMethod("mobile_money")}
                      className={
                        paymentMethod === "mobile_money"
                          ? "bg-black hover:bg-orange-500"
                          : ""
                      }
                    >
                      <Smartphone className="mr-2 h-4 w-4" />
                      MoMo
                    </Button>
                  </div>
                </div>

                {/* Amount Paid */}
                <div>
                  <Label
                    htmlFor="amountPaid"
                    className="mb-2 block text-sm font-medium"
                  >
                    Amount Paid
                  </Label>
                  <Input
                    id="amountPaid"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amountPaid || ""}
                    onChange={(e) =>
                      setAmountPaid(parseFloat(e.target.value) || 0)
                    }
                    className="h-10"
                  />
                </div>

                {/* Change */}
                {amountPaid >= total && total > 0 && (
                  <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Change
                      </span>
                      <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                        GHS {change.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Charge Button */}
                <Button
                  onClick={handleCharge}
                  disabled={isChargeDisabled || loading}
                  className="w-full bg-black text-white hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Charge"
                  )}
                </Button>

                {/* Receipt Button */}
                {showReceipt && (
                  <Button
                    onClick={() => openReceipt(showReceipt)}
                    variant="outline"
                    className="w-full"
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    View Receipt
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
