/**
 * EasyDigia logo mark — "Nexus + Velocity": an "E" drawn as a network of nodes
 * whose arms accelerate into forward chevrons (AI/automation + speed).
 * Brand lime on transparent; pairs with the "EasyDigia" wordmark.
 */
export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} role="img" aria-label="EasyDigia">
      <defs>
        <linearGradient id="ed-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8FD400" />
          <stop offset="1" stopColor="#C6FF00" />
        </linearGradient>
      </defs>
      {/* spine + arms (the "E") */}
      <g stroke="url(#ed-mark)" strokeWidth="2.4" strokeLinecap="round">
        <path d="M12 10 V38" />
        <path d="M12 10 H28" />
        <path d="M12 24 H31" />
        <path d="M12 38 H28" />
      </g>
      {/* motion chevrons at the arm ends (velocity) */}
      <g stroke="#C6FF00" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M30 6 L36 10 L30 14" />
        <path d="M33 20 L39 24 L33 28" />
        <path d="M30 34 L36 38 L30 42" />
      </g>
      {/* nodes on the spine */}
      <g fill="#C6FF00">
        <circle cx="12" cy="10" r="3.6" />
        <circle cx="12" cy="24" r="3.6" />
        <circle cx="12" cy="38" r="3.6" />
      </g>
    </svg>
  );
}
