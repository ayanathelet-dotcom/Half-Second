export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="display text-[clamp(2.25rem,5vw,3.5rem)]">{title}</h1>
        {subtitle && <p className="mt-2 text-mute">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
