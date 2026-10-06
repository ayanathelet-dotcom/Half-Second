import { ENQUIRY_STATUS, VIDEO_STATUS } from "../../lib/status.js";

export default function Badge({ kind = "enquiry", value }) {
  const map = kind === "video" ? VIDEO_STATUS : ENQUIRY_STATUS;
  const item = map[value] || { label: value, cls: "bg-ink/10 text-mute" };
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.cls}`}
    >
      {item.label}
    </span>
  );
}
