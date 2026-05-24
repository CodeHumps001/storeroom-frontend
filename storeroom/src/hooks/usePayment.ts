import { useState } from "react";
import apiRequest from "@/lib/api";

const MONTHLY_PRICE_GHS = 50; // set your price here

const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest("/payments/initialize", {
        method: "POST",
        body: JSON.stringify({ amount: MONTHLY_PRICE_GHS }),
      });
      // Redirect to Paystack checkout
      window.location.href = response.data.authorizationUrl;
    } catch (err: any) {
      setError(err.message || "Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  return { initializePayment, loading, error };
};

export { usePayment };
