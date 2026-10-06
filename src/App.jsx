import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollManager from "./components/ScrollManager.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { PageLoader } from "./components/ui/Spinner.jsx";
import SiteLayout from "./layouts/SiteLayout.jsx";
import Home from "./pages/site/Home.jsx";
import Work from "./pages/site/Work.jsx";
import Contact from "./pages/site/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminRoot from "./pages/admin/AdminRoot.jsx";

// The dashboard is loaded only when needed, so the public website stays fast
const Login = lazy(() => import("./pages/admin/Login.jsx"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout.jsx"));
const Overview = lazy(() => import("./pages/admin/Overview.jsx"));
const Videos = lazy(() => import("./pages/admin/Videos.jsx"));
const Enquiries = lazy(() => import("./pages/admin/Enquiries.jsx"));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* public website */}
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="work" element={<Work />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* admin */}
          <Route path="admin" element={<AdminRoot />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="dashboard" element={<Overview />} />
                <Route path="videos" element={<Videos />} />
                <Route path="enquiries" element={<Enquiries />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "#121418", color: "#e9ebed", borderRadius: "4px", fontSize: "0.92rem", fontWeight: 600 },
          success: { iconTheme: { primary: "#ffd60a", secondary: "#121418" } },
        }}
      />
    </BrowserRouter>
  );
}
