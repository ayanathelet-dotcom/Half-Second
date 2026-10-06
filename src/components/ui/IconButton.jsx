export default function IconButton({ label, children, className = "", ...props }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`grid size-9 place-items-center rounded-[4px] text-mute transition-colors hover:bg-ink/8 hover:text-ink disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
