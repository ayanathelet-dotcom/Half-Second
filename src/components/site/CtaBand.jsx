import { Link } from "react-router-dom";
import { buttonClasses } from "../ui/Button.jsx";
import { container } from "../../lib/status.js";

export default function CtaBand() {
  return (
    <section className="on-dark bg-chroma text-white">
      <div className={`${container} flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center md:py-20`}>
        <h2 className="display max-w-2xl text-[clamp(2.5rem,6vw,5rem)]">Got footage sitting on a drive?</h2>
        <Link to="/contact" className={buttonClasses({ variant: "light", size: "lg" })}>
          Book a meeting
        </Link>
      </div>
    </section>
  );
}
