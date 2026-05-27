"use client";

import { useState, useEffect } from "react";
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
  X,
  LayoutGrid,
  List,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import apiRequest from "@/lib/api";
import { useProducts } from "@/hooks/useProducts";
import { getToken } from "@/lib/auth";
import { Product } from "@/types";
import { useMe } from "@/hooks/Useme";
import ProductGrid from "@/components/pos/ProductGrid";
import ProductList from "@/components/pos/productList";
import Image from "next/image";

interface CartItem {
  product: Product;
  quantity: number;
}

type PaymentMethod = "CASH" | "CARD" | "MOBILE_MONEY";
type Toast = { type: "success" | "error"; message: string } | null;
type ViewMode = "grid" | "list";

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "CARD", label: "Card", icon: CreditCard },
  { value: "MOBILE_MONEY", label: "MoMo", icon: Smartphone },
];

// Get unique categories from products
const getUniqueCategories = (products: Product[]) => {
  const categories = new Set(products.map((p) => p.category.name));
  return ["All", ...Array.from(categories)];
};

export default function POSPage() {
  const { products, loading: productsLoading } = useProducts();
  const { me } = useMe();

  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [showReceipt, setShowReceipt] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [receiptTimeout, setReceiptTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");

  // Load saved view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem("posViewMode") as ViewMode;
    if (savedView && (savedView === "grid" || savedView === "list")) {
      setViewMode(savedView);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("posViewMode", mode);
  };

  // Filter products by search term and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = getUniqueCategories(products);
  const total = cart.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity,
    0,
  );
  const paid = parseFloat(amountPaid) || 0;
  const change = paid >= total ? paid - total : 0;
  const isChargeDisabled = cart.length === 0 || paid < total || total === 0;

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: qty } : i,
        ),
      );
    }
  };

  const removeItem = (productId: string) =>
    setCart((prev) => prev.filter((i) => i.product.id !== productId));

  const clearCart = () => {
    setCart([]);
    setAmountPaid("");
    setCustomerPhone("");
    setCustomerName("");
  };

  const openReceipt = async (saleId: string) => {
    try {
      const token = getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sales/${saleId}/receipt`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!response.ok) throw new Error("Failed to fetch receipt");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `receipt-${saleId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast(
          "success",
          "Receipt downloaded! Check your downloads folder.",
        );
      } else {
        window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (err) {
      showToast("error", "Failed to load receipt. Please try again.");
    }
  };

  const handleCharge = async () => {
    if (isChargeDisabled) return;
    setLoading(true);
    try {
      const response = await apiRequest("/sales", {
        method: "POST",
        body: JSON.stringify({
          items: cart.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
          paymentMethod,
          amountPaid: paid,
          customerPhone: customerPhone || undefined,
          customerName: customerName || undefined,
        }),
      });
      const saleId = response.data.id;
      clearCart();
      setShowReceipt(saleId);
      setCartOpen(false);
      showToast("success", "Sale completed! Receipt is ready.");

      if (receiptTimeout) {
        clearTimeout(receiptTimeout);
      }

      const timeout = setTimeout(() => {
        setShowReceipt(null);
      }, 10000);

      setReceiptTimeout(timeout);
    } catch (err: any) {
      showToast("error", err.message || "Failed to process sale");
    } finally {
      setLoading(false);
    }
  };

  if (productsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">Loading POS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-900">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/60 dark:text-red-200"
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
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="relative h-7 w-7 overflow-hidden rounded-md">
              <Image
                src="/logo.jpeg"
                alt="Storeroom Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-semibold">
              <span className="text-black dark:text-white">Store</span>
              <span className="text-orange-500">room</span>
              <span className="ml-1 text-xs font-normal text-zinc-500">
                POS
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {me && (
            <span className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">
              {me.name} · {me.role}
            </span>
          )}

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white lg:hidden"
          >
            <ShoppingBag className="h-4 w-4" />
            {cart.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
            Cart
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — Products */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Search + Category Tabs + View Toggle */}
          <div className="shrink-0 border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                type="text"
                placeholder={`Search ${products.length} products...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-9 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-orange-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* View Toggle + Results Count */}
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-zinc-400">
                {filteredProducts.length} of {products.length} products
              </p>
              <div className="flex gap-1 rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-700">
                <button
                  onClick={() => handleViewModeChange("grid")}
                  className={`rounded-md p-1.5 transition-all ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleViewModeChange("list")}
                  className={`rounded-md p-1.5 transition-all ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white"
                      : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product area */}
          <div className="flex-1 overflow-y-auto p-4">
            {viewMode === "grid" ? (
              <ProductGrid
                products={filteredProducts}
                onAddToCart={addToCart}
              />
            ) : (
              <ProductList
                products={filteredProducts}
                onAddToCart={addToCart}
              />
            )}
          </div>
        </div>

        {/* Right — Cart (desktop) */}
        <div className="hidden w-80 shrink-0 flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:flex xl:w-96">
          <CartPanel
            cart={cart}
            total={total}
            paid={paid}
            amountPaid={amountPaid}
            setAmountPaid={setAmountPaid}
            change={change}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            clearCart={clearCart}
            handleCharge={handleCharge}
            isChargeDisabled={isChargeDisabled}
            loading={loading}
            showReceipt={showReceipt}
            onPrintReceipt={openReceipt}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            customerName={customerName}
            setCustomerName={setCustomerName}
          />
        </div>
      </div>

      {/* Mobile Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCartOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 flex max-h-[90vh] flex-col rounded-t-2xl bg-white dark:bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <h2 className="font-semibold">Current Order</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto">
              <CartPanel
                cart={cart}
                total={total}
                paid={paid}
                amountPaid={amountPaid}
                setAmountPaid={setAmountPaid}
                change={change}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
                clearCart={clearCart}
                handleCharge={handleCharge}
                isChargeDisabled={isChargeDisabled}
                loading={loading}
                showReceipt={showReceipt}
                onPrintReceipt={openReceipt}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                customerName={customerName}
                setCustomerName={setCustomerName}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Cart Panel ────────────────────────────────────────────────────────────────

interface CartPanelProps {
  cart: CartItem[];
  total: number;
  paid: number;
  amountPaid: string;
  setAmountPaid: (v: string) => void;
  change: number;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (v: PaymentMethod) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  handleCharge: () => void;
  isChargeDisabled: boolean;
  loading: boolean;
  showReceipt: string | null;
  onPrintReceipt: (saleId: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  customerName: string;
  setCustomerName: (v: string) => void;
}

function CartPanel({
  cart,
  total,
  paid,
  amountPaid,
  setAmountPaid,
  change,
  paymentMethod,
  setPaymentMethod,
  updateQuantity,
  removeItem,
  clearCart,
  handleCharge,
  isChargeDisabled,
  loading,
  showReceipt,
  onPrintReceipt,
  customerPhone,
  setCustomerPhone,
  customerName,
  setCustomerName,
}: CartPanelProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Cart header */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-zinc-500" />
          <span className="text-sm font-semibold">
            Order
            {cart.length > 0 && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </span>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-500 hover:text-red-600"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <ShoppingBag className="h-10 w-10 text-zinc-200 dark:text-zinc-700" />
            <p className="mt-2 text-sm font-medium text-zinc-400">
              Cart is empty
            </p>
            <p className="text-xs text-zinc-300 dark:text-zinc-600">
              Tap a product to add it
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.product.name}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    GHS {item.product.sellingPrice.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:border-orange-400 hover:text-orange-500 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:border-orange-400 hover:text-orange-500 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    GHS {(item.product.sellingPrice * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-zinc-300 hover:text-red-500 dark:text-zinc-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary + Payment */}
      <div className="shrink-0 border-t border-zinc-100 dark:border-zinc-800">
        {/* Customer Info Section */}
        <div className="space-y-2 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <Label className="text-xs font-medium text-zinc-500 flex items-center gap-1">
            <Phone className="h-3 w-3" />
            Customer Phone (for SMS receipt)
          </Label>
          <Input
            type="tel"
            placeholder="e.g., 024XXXXXXX"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="h-8 text-sm"
          />
          <Input
            type="text"
            placeholder="Customer name (optional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="h-8 text-sm"
          />
        </div>

        {/* Total */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium text-zinc-500">Total</span>
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            GHS {total.toFixed(2)}
          </span>
        </div>

        {/* Payment + Charge */}
        <div className="space-y-3 px-4 pb-4">
          {/* Payment method */}
          <div className="grid grid-cols-3 gap-1.5">
            {PAYMENT_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setPaymentMethod(value)}
                className={`flex flex-col items-center gap-1 rounded-lg border py-2 text-[10px] font-semibold transition-all ${
                  paymentMethod === value
                    ? "border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400"
                    : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Amount paid */}
          <div>
            <Label className="mb-1 block text-xs font-medium text-zinc-500">
              Amount Paid (GHS)
            </Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder={`Min: ${total.toFixed(2)}`}
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          {/* Change */}
          {paid >= total && total > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-950/20">
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Change
              </span>
              <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                GHS {change.toFixed(2)}
              </span>
            </div>
          )}

          {/* Insufficient amount warning */}
          {paid > 0 && paid < total && (
            <div className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2 dark:bg-red-950/20">
              <span className="text-xs font-medium text-red-600 dark:text-red-400">
                Short by
              </span>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                GHS {(total - paid).toFixed(2)}
              </span>
            </div>
          )}

          {/* Charge button */}
          <button
            onClick={handleCharge}
            disabled={isChargeDisabled || loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white transition-all hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-orange-500 dark:hover:text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Charge · GHS {total.toFixed(2)}</>
            )}
          </button>

          {/* Receipt button - shown after successful charge */}
          {showReceipt && (
            <button
              onClick={() => onPrintReceipt(showReceipt)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-500 bg-white py-3 text-sm font-semibold text-emerald-600 transition-all hover:bg-emerald-50 dark:border-emerald-600 dark:bg-transparent dark:text-emerald-400 dark:hover:bg-emerald-950/20"
            >
              <Receipt className="h-4 w-4" />
              Print Receipt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
