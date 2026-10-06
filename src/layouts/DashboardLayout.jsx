import { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ExternalLink, Film, Inbox, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../lib/api.js";
import Logo from "../components/ui/Logo.jsx";

const nav = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/videos", label: "Videos", icon: Film },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox, badge: true },
];

export default function DashboardLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [newCount, setNewCount] = useState(0);

  // pages call this after changing an enquiry so the sidebar count stays right
  const refreshCounts = useCallback(() => {
    api
      .get("/admin/enquiries/stats")
      .then((r) => setNewCount(r.data.data.new || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts, pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const itemClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-[0.95rem] font-semibold transition-colors ${
      isActive ? "bg-white/12 text-white" : "text-mute-dark hover:bg-white/6 hover:text-white"
    }`;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16.5rem_1fr]">
      {/* sidebar (desktop) */}
      <aside className="on-dark sticky top-0 hidden h-screen flex-col bg-ink p-5 text-paper lg:flex">
        <Logo className="px-1 pt-1" />
        <nav className="mt-10 flex flex-col gap-1" aria-label="Dashboard">
          {nav.map(({ to, label, icon: Icon, badge }) => (
            <NavLink key={to} to={to} className={itemClass}>
              <Icon className="size-5" />
              <span className="flex-1">{label}</span>
              {badge && newCount > 0 && (
                <span className="tabular rounded-full bg-chroma px-2 py-0.5 text-xs font-bold text-white">{newCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-line-dark pt-4">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-[0.95rem] font-semibold text-mute-dark hover:bg-white/6 hover:text-white">
            <ExternalLink className="size-5" /> View website
          </a>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-[4px] px-3 py-2.5 text-[0.95rem] font-semibold text-mute-dark hover:bg-white/6 hover:text-white">
            <LogOut className="size-5" /> Log out
          </button>
          <div className="mt-3 px-3">
            <p className="truncate text-sm font-semibold">{admin?.name}</p>
            <p className="truncate text-xs text-mute-dark">{admin?.email}</p>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        {/* top bar (mobile) */}
        <header className="on-dark bg-ink text-paper lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Logo />
            <button onClick={handleLogout} aria-label="Log out" className="grid size-10 place-items-center rounded-[4px] text-mute-dark hover:text-white">
              <LogOut className="size-5" />
            </button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3" aria-label="Dashboard">
            {nav.map(({ to, label, icon: Icon, badge }) => (
              <NavLink key={to} to={to} className={itemClass}>
                <Icon className="size-4" /> {label}
                {badge && newCount > 0 && (
                  <span className="tabular rounded-full bg-chroma px-1.5 text-xs font-bold text-white">{newCount}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-[78rem] p-5 sm:p-8 lg:p-10">
          <Outlet context={{ refreshCounts }} />
        </main>
      </div>
    </div>
  );
}
