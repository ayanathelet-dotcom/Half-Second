import { Outlet } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext.jsx";

// Only the /admin routes check login, so public visitors never trigger an auth request
export default function AdminRoot() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
