import { Link } from "react-router-dom";

// One panel with dividers between the numbers, so it reads as a single readout
export default function StatStrip({ title, to, items }) {
  return (
    <section className="rounded-xl border border-line bg-panel">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <h2 className="font-bold">{title}</h2>
        {to && (
          <Link to={to} className="text-sm font-semibold text-chroma hover:underline">
            Manage
          </Link>
        )}
      </div>
      <dl className="grid grid-cols-2 sm:grid-cols-4 [&>div:nth-child(n+3)]:border-t [&>div:nth-child(n+3)]:border-line sm:[&>div:nth-child(n+3)]:border-t-0 sm:[&>div+div]:border-l sm:[&>div+div]:border-line">
        {items.map((it) => (
          <div key={it.label} className="px-5 py-5">
            <dd className={`display tabular text-5xl ${it.highlight ? "text-chroma" : ""}`}>{it.value ?? "-"}</dd>
            <dt className="mt-2 text-sm text-mute">{it.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
