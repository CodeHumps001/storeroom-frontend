export interface Product {
  id: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  barcode?: string;
  imageUrl?: string;
  category: { name: string };
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  organizationId: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  totalAmount: number;
  amountPaid: number;
  change: number;
  paymentMethod: string;
  userId: string;
  createdAt: string;
  items: SaleItem[];
}

export interface Credit {
  id: string;
  customerName: string;
  customerPhone: string | null;
  amount: number;
  amountPaid: number;
  note: string | null;
  isPaid: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}
