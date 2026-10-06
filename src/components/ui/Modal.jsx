import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

// Several modals can be open at once, so count the scroll locks
let locks = 0;
const lockScroll = () => {
  if (locks++ === 0) document.body.style.overflow = "hidden";
  return () => {
    if (--locks === 0) document.body.style.overflow = "";
  };
};

const widths = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };

export default function Modal({
  open,
  onClose,
  title,
  children,
  variant = "modal", // "modal" | "drawer"
  size = "md",
  dark = false,
  locked = false, // blocks Esc and backdrop clicks (e.g. while uploading)
  hideHeader = false,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !locked) onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const unlock = lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlock();
    };
  }, [open, onClose, locked]);

  const drawer = variant === "drawer";
  const tone = dark ? "bg-ink text-paper on-dark" : "bg-panel text-ink";

  return (
    <AnimatePresence>
      {open && (
        <div
          className={`fixed inset-0 z-50 flex ${drawer ? "" : "p-3 sm:p-6"}`}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !locked && onClose?.()}
          />
          <motion.div
            className={
              drawer
                ? `relative ml-auto flex h-full w-full max-w-lg flex-col shadow-2xl ${tone}`
                : `relative m-auto w-full ${widths[size]} max-h-[92vh] overflow-y-auto rounded-xl shadow-2xl ${tone}`
            }
            initial={drawer ? { x: "100%" } : { opacity: 0, y: 14, scale: 0.98 }}
            animate={drawer ? { x: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={drawer ? { x: "100%" } : { opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {hideHeader ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-ink/70 text-paper backdrop-blur hover:bg-ink"
              >
                <X className="size-5" />
              </button>
            ) : (
              <div
                className={`flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6 ${
                  dark ? "border-line-dark" : "border-line"
                }`}
              >
                <h2 className="text-lg font-bold">{title}</h2>
                <button
                  type="button"
                  onClick={() => !locked && onClose?.()}
                  disabled={locked}
                  aria-label="Close"
                  className="grid size-9 place-items-center rounded-[4px] text-mute hover:bg-ink/8 hover:text-ink disabled:opacity-40"
                >
                  <X className="size-5" />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
