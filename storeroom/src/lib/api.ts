import { deleteToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  options.headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    // Login expired or token rejected: clear it and go to login, then come back
    if (response.status === 401 && token && !endpoint.startsWith("/auth/login")) {
      deleteToken();
      if (!window.location.pathname.startsWith("/login")) {
        const here = window.location.pathname + window.location.search;
        window.location.href = `/login?next=${encodeURIComponent(here)}`;
      }
    }

    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

export default apiRequest;