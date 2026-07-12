import Link from "next/link";

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
};

export function Button({ children, href, variant = "primary", type = "button" }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-3 font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-brand text-white hover:opacity-90"
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
