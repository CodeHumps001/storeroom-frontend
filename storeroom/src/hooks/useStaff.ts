import apiRequest from "@/lib/api";
import { Staff } from "@/types";
import { useEffect, useState } from "react";

const useStaff = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function fetchStaff() {
    try {
      setLoading(true);
      const response = await apiRequest("/staff", {
        method: "GET",
      });

      setStaffs(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStaff();
  }, []);

  return { fetchStaff, loading, error, staffs };
};

export { useStaff };
