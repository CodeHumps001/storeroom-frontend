const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const saveToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
};

const deleteToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  document.cookie = `token=; path=/; max-age=0`;
};

export { getToken, saveToken, deleteToken };
