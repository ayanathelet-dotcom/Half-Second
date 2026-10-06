export default function EmptyState({ title, text, action, dark = false }) {
  return (
    <div
      className={`rounded-xl border border-dashed px-6 py-14 text-center ${
        dark ? "border-line-dark" : "border-line"
      }`}
    >
      <p className="text-lg font-bold">{title}</p>
      {text && <p className={`mx-auto mt-1.5 max-w-sm ${dark ? "text-mute-dark" : "text-mute"}`}>{text}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
