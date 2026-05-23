import { useState } from "react";
import apiRequest from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  // 1. State for loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // 2. A login function that takes email and password
  async function login(email: string, password: string) {
    try {
      //    - calls apiRequest
      setLoading(true);
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      //    - saves the token
      saveToken(response.token);
      //    - redirects to /products
      router.push("/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 3. Return loading, error, and the login function
  return { loading, error, login };
};
