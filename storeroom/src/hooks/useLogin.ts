import { useState } from "react";
import apiRequest from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { postLoginPath, roleFromToken } from "@/lib/roles";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function login(email: string, password: string) {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      saveToken(response.token);

      // Role comes from the new token (falls back to the response body).
      // ?next= brings people back to the page they were bounced from,
      // e.g. a phone opening a /scan?c=... pairing link while logged out.
      const role = roleFromToken(response.token) ?? response.data?.role;
      const next = new URLSearchParams(window.location.search).get("next");

      // replace, not push, so the Back button doesn't return to the login page
      router.replace(postLoginPath(role, next));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, login };
};