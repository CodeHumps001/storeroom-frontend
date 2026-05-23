import { useEffect, useState } from "react";
import apiRequest from "@/lib/api";

interface Me {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: {
    organizationName: string;
    organizationType: string;
    location: string;
    contact: string;
  };
}

const useMe = () => {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/auth/me");
        setMe(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  return { me, loading, error };
};

export { useMe };
