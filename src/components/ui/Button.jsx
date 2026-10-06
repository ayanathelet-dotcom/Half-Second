import Spinner from "./Spinner.jsx";

const base =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[4px] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "bg-chroma text-white hover:bg-chroma-deep",
  ink: "bg-ink text-paper hover:bg-ink-2",
  light: "bg-paper text-ink hover:bg-white",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink/5",
  outlineLight: "border border-white/30 text-white hover:border-white hover:bg-white/10",
  ghost: "text-ink hover:bg-ink/8",
  danger: "bg-danger text-white hover:bg-[#a82716]",
};

const sizes = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

// Use on <Link> or <a> so links look exactly like buttons
export const buttonClasses = ({ variant = "primary", size = "md", className = "" } = {}) =>
  `${base} ${variants[variant]} ${sizes[size]} ${className}`;

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled,
  children,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
