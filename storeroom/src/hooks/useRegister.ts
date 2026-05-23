import { useState } from "react";
import apiRequest from "@/lib/api";
import { getToken, saveToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (
    organizationName: string,
    organizationType: string,
    location: string,
    contact: string,
    name: string,
    email: string,
    password: string,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          organizationName,
          organizationType,
          location,
          contact,
          name,
          email,
          password,
          role: "OWNER", // Adding the role as specified in your backend
        }),
      });

      // Save the token if registration is successful
      if (response.token) {
        saveToken(response.token);
      }

      // Optional: Get and store user info from token
      const userInfo = getToken();

      // Redirect to dashboard or login page
      router.push("/dashboard");

      return response;
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      throw err; // Re-throw so the component can handle it if needed
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
  };
};
