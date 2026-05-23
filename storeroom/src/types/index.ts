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
