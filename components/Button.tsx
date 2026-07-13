import { Link } from "@/i18n/navigation";

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
};

export function Button({ children, href, variant = "primary", type = "button" }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold transition";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-br from-brand to-brand-bright text-base shadow-[0_4px_20px_rgba(143,212,0,0.35)] hover:opacity-90"
      : "border border-ink/20 text-ink hover:bg-ink/10";
  const cls = `${base} ${styles}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls}>
      {children}
    </button>
  );
}
