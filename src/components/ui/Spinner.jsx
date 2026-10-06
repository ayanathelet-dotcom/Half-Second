export default function Spinner({ className = "size-4" }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}

export function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-mute">
      <Spinner className="size-6" />
    </div>
  );
}
