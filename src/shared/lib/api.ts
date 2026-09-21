import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3001/api" : "");

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || "Request failed";
    const error = new Error(message) as Error & { retryAfter?: number };
    if (typeof err.response?.data?.retryAfter === "number") {
      error.retryAfter = err.response.data.retryAfter;
    }
    return Promise.reject(error);
  },
);

export default api;
