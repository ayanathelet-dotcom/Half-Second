import { Link } from "react-router-dom";
import Logo from "../ui/Logo.jsx";
import { SITE } from "../../config/site.js";
import { container } from "../../lib/status.js";

export default function Footer() {
  return (
    <footer className="on-dark bg-ink text-paper">
      <div className={`${container} grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]`}>
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-mute-dark">
            Video editing for brands and creators. Send us the footage, get back something people watch to the end.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-mute-dark">Explore</p>
          <ul className="mt-4 space-y-2.5 font-semibold">
            <li><Link to="/work" className="hover:text-signal">Work</Link></li>
            <li><Link to="/#services" className="hover:text-signal">Services</Link></li>
            <li><Link to="/contact" className="hover:text-signal">Book a meeting</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-mute-dark">Get in touch</p>
          <ul className="mt-4 space-y-2.5 font-semibold">
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-signal">{SITE.email}</a>
            </li>
            {SITE.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-signal">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line-dark">
        <div className={`${container} py-5 text-sm text-mute-dark`}>
          &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
