import { SITE } from "../../config/site.js";

// The mark is two clips with a diagonal cut between them
export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <path d="M3 5h14L11 27H3z" fill="#2a3bff" />
        <path d="M21 5h8v22H15z" fill="currentColor" />
      </svg>
      <span className="display text-[1.55rem]">{SITE.name}</span>
    </span>
  );
}
