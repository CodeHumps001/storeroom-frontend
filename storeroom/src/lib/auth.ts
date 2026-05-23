const getToken = () => {
  return localStorage.getItem("token");
};
const saveToken = (token: string) => {
  localStorage.setItem("token", token);
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
};
const deleteToken = () => {
  localStorage.removeItem("token");
};

export { getToken, saveToken, deleteToken };
