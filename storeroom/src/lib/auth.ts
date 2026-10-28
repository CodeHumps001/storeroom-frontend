const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const saveToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`;
};

const deleteToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `token=; path=/; max-age=0; SameSite=Lax${secure}`;
};

export { getToken, saveToken, deleteToken };