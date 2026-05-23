import apiRequest from "@/lib/api";
import { Category } from "@/types";
import { useEffect, useState } from "react";

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function fetchCategory() {
    try {
      setLoading(true);
      const response = await apiRequest("/categories", {
        method: "GET",
      });

      setCategories(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchCategory();
  }, []);

  return { fetchCategory, loading, error, categories };
};

export { useCategories };
