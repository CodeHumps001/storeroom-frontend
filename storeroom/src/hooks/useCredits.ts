import apiRequest from "@/lib/api";
import { Credit } from "@/types";
import { useEffect, useState } from "react";

const useCredits = () => {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [meta, setMeta] = useState({ total: 0, unpaid: 0, totalOwed: 0 });

  async function fetchCredits() {
    try {
      setLoading(true);
      const response = await apiRequest("/credits", {
        method: "GET",
      });

      setCredits(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCredits();
  }, []);

  return { fetchCredits, loading, error, credits, meta };
};

export { useCredits };
