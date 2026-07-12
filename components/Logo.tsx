/* eslint-disable @next/next/no-img-element */
/**
 * EasyDigia brand logo (client-provided image). It already contains the
 * wordmark, so it stands alone — no separate text label beside it.
 */
export function Logo({ className = "h-11" }: { className?: string }) {
  return (
    <img
      src="/logo-easydigia.jpeg"
      alt="EasyDigia — Automatisez. Accélérez. Grandissez."
      className={`w-auto rounded-xl ${className}`}
    />
  );
}
