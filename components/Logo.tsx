import Image from "next/image";

export function Logo({ className = "h-14" }: { className?: string }) {
  return (
    <Image
      src="/logo-easydigia-new.jpeg"
      alt="EasyDigia — Automatisez. Accélérez. Grandissez."
      width={168}
      height={112}
      className={`w-auto object-contain ${className}`}
      priority
    />
  );
}
