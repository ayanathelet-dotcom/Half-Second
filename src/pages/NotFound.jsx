import { Link } from "react-router-dom";
import { buttonClasses } from "../components/ui/Button.jsx";
import useTitle from "../hooks/useTitle.js";

export default function NotFound() {
  useTitle("Page not found");
  return (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="display text-[clamp(6rem,24vw,16rem)] text-chroma">404</p>
        <h1 className="mt-2 text-2xl font-bold">This page didn't make the final cut.</h1>
        <p className="mt-2 text-mute">The link may be broken, or the page may have moved.</p>
        <Link to="/" className={buttonClasses({ variant: "ink", size: "lg", className: "mt-8" })}>
          Back to the homepage
        </Link>
      </div>
    </div>
  );
}
