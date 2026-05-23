import apiRequest from "@/lib/api";
import { Sale, Staff } from "@/types";
import { useEffect, useState } from "react";

const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function fetchSales() {
    try {
      setLoading(true);
      const response = await apiRequest("/sales", {
        method: "GET",
      });

      setSales(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSales();
  }, []);

  return { fetchSales, loading, error, sales };
};

export { useSales };
