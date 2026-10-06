export const formatDate = (iso, opts = { day: "numeric", month: "short", year: "numeric" }) =>
  iso ? new Date(iso).toLocaleDateString(undefined, opts) : "";

export const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

// preferredDate is stored as UTC midnight, so read it in UTC to avoid off-by-one days
export const formatPreferred = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

export const weekdayOf = (yyyyMmDd) =>
  yyyyMmDd
    ? new Date(`${yyyyMmDd}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" })
    : "";

export const todayUTC = () => new Date().toISOString().slice(0, 10);

export const formatBytes = (bytes) => {
  if (!bytes) return "0 MB";
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
};

export const timeAgo = (iso) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return formatDate(iso);
};
