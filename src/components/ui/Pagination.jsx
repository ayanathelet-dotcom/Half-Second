import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button.jsx";

export default function Pagination({ page, pages, onChange, className = "" }) {
  if (!pages || pages <= 1) return null;
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="size-4" /> Previous
      </Button>
      <span className="tabular text-sm text-mute">
        Page {page} of {pages}
      </span>
      <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Next <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
