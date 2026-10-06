import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../ui/Logo.jsx";
import { buttonClasses } from "../ui/Button.jsx";
import { container } from "../../lib/status.js";

const links = [
  { to: "/work", label: "Work" },
  { to: "/#services", label: "Services", hash: true },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  const linkClass = ({ isActive }) =>
    `relative py-1 text-[0.95rem] font-semibold transition-colors ${
      isActive ? "text-chroma" : "text-ink hover:text-chroma"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur">
      <div className={`${container} flex h-16 items-center justify-between`}>
        <Link to="/" aria-label="Home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((l) =>
            l.hash ? (
              <Link key={l.to} to={l.to} className="py-1 text-[0.95rem] font-semibold hover:text-chroma">
                {l.label}
              </Link>
            ) : (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            )
          )}
          <Link to="/contact" className={buttonClasses({ variant: "ink", size: "sm" })}>
            Book a meeting
          </Link>
        </nav>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-[4px] hover:bg-ink/8 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink/10 bg-paper md:hidden" aria-label="Mobile">
          <div className={`${container} flex flex-col gap-1 py-4`}>
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-[4px] px-1 py-3 text-lg font-semibold">
                {l.label}
              </Link>
            ))}
            <Link to="/contact" className={buttonClasses({ variant: "ink", size: "lg", className: "mt-2" })}>
              Book a meeting
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
