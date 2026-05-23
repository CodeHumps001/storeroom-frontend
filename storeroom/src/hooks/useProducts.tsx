import apiRequest from "@/lib/api";
import { Product } from "@/types";
import { useEffect, useState } from "react";

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await apiRequest("/products", {
        method: "GET",
      });

      setProducts(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return { fetchProducts, loading, error, products };
};

export { useProducts };
