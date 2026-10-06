export const inputClass =
  "w-full rounded-[4px] border border-line bg-white px-3.5 py-2.5 text-[0.95rem] text-ink placeholder:text-mute/70 focus:border-chroma focus:outline-none focus:ring-2 focus:ring-chroma/20";

export function Field({ label, htmlFor, hint, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-mute">{hint}</p>
      ) : null}
    </div>
  );
}
