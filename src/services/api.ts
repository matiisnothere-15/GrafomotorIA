export const BASE_URL = import.meta.env.VITE_API_URL + "/api";

export const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
});
