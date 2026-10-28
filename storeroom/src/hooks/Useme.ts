"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import apiRequest from "@/lib/api";

export interface Me {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: {
    organizationName: string;
    organizationType: string;
    location: string;
    contact: string;
    plan: string;
    subscriptionStatus: string;
    subscriptionExpiry: string | null;
  };
  trial?: {
    isActive: boolean;
    daysLeft: number;
    endsAt: string | null;
  };
}

export interface MeState {
  me: Me | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/** Filled by <AuthGuard>, so the whole page shares ONE /auth/me request. */
export const MeContext = createContext<MeState | null>(null);

export function useFetchMe(enabled = true): MeState {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest("/auth/me");
      setMe(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) fetchMe();
  }, [enabled, fetchMe]);

  return { me, loading, error, refetch: fetchMe };
}

/** Same API as before. Inside an <AuthGuard> it reuses the shared result;
 *  anywhere else it falls back to fetching on its own. */
const useMe = (): MeState => {
  const shared = useContext(MeContext);
  const own = useFetchMe(shared === null);
  return shared ?? own;
};

export { useMe };