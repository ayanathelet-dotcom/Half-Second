import axios from "axios";

// withCredentials makes the browser send the httpOnly login cookie.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

// If the session expires while you're using the dashboard, go back to login.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    const path = window.location.pathname;
    const isAuthCall = url.includes("/admin/auth/");
    if (
      err.response?.status === 401 &&
      !isAuthCall &&
      path.startsWith("/admin") &&
      path !== "/admin/login"
    ) {
      window.location.assign("/admin/login");
    }
    return Promise.reject(err);
  }
);

export const getErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === "ERR_NETWORK") return "Can't reach the server. Check that the backend is running.";
  return fallback;
};

export default api;
