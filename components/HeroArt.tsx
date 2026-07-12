/**
 * Custom animated SVG illustration — an abstract "AI automation network".
 * Brand-styled (lime on near-black), self-contained, no external assets.
 */
export function HeroArt() {
  return (
    <div className="animate-float relative mx-auto w-full max-w-[460px]">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 animate-glow rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(143,212,0,0.30), transparent 68%)" }}
      />
      <svg
        viewBox="0 0 460 420"
        role="img"
        aria-label="Réseau d'agents et d'automatisations IA connectés"
        className="w-full"
      >
        <defs>
          <linearGradient id="lime" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8FD400" />
            <stop offset="1" stopColor="#C6FF00" />
          </linearGradient>
          <radialGradient id="node" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#C6FF00" />
            <stop offset="1" stopColor="#5E9200" />
          </radialGradient>
          <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* connectors with animated flow */}
        <g stroke="url(#lime)" strokeWidth="1.6" fill="none" opacity="0.5">
          <path d="M230 210 L120 96" strokeDasharray="6 8">
            <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="2.2s" repeatCount="indefinite" />
          </path>
          <path d="M230 210 L360 110" strokeDasharray="6 8">
            <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="2.6s" repeatCount="indefinite" />
          </path>
          <path d="M230 210 L92 268" strokeDasharray="6 8">
            <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="2.4s" repeatCount="indefinite" />
          </path>
          <path d="M230 210 L372 288" strokeDasharray="6 8">
            <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="2.9s" repeatCount="indefinite" />
          </path>
          <path d="M230 210 L214 350" strokeDasharray="6 8">
            <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="2.1s" repeatCount="indefinite" />
          </path>
        </g>

        {/* central hub */}
        <circle cx="230" cy="210" r="46" fill="#12141C" stroke="url(#lime)" strokeWidth="2" />
        <circle cx="230" cy="210" r="46" fill="none" stroke="#C6FF00" strokeWidth="2" opacity="0.6">
          <animate attributeName="r" values="46;60;46" dur="3.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="3.4s" repeatCount="indefinite" />
        </circle>
        <text x="230" y="222" textAnchor="middle" fontSize="34" fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fill="url(#lime)">E</text>

        {/* satellite nodes */}
        {[
          { x: 120, y: 96, r: 20, label: "🌐" },
          { x: 360, y: 110, r: 22, label: "🤖" },
          { x: 92, y: 268, r: 18, label: "⚙️" },
          { x: 372, y: 288, r: 20, label: "💬" },
          { x: 214, y: 350, r: 18, label: "🎓" },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r + 6} fill="url(#node)" opacity="0.18" filter="url(#soft)" />
            <circle cx={n.x} cy={n.y} r={n.r} fill="#12141C" stroke="url(#lime)" strokeWidth="1.6" />
            <text x={n.x} y={n.y + 6} textAnchor="middle" fontSize={n.r}>{n.label}</text>
            <animate attributeName="opacity" values="1;0.75;1" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
          </g>
        ))}
      </svg>
    </div>
  );
}
