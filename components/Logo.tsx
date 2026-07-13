/* eslint-disable @next/next/no-img-element */
export function Logo({ className = "h-14" }: { className?: string }) {
  return (
    <img
      src="/logo-easydigia-new.jpeg"
      alt="EasyDigia — Automatisez. Accélérez. Grandissez."
      className={`w-auto object-contain ${className}`}
    />
  );
}
