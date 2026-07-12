/**
 * Custom animated SVG illustration for the About page — an abstract
 * "growth & impact" scene (rising bars + trend line). Brand-styled, self-contained.
 */
export function AboutArt() {
  const bars = [
    { x: 40, h: 60, d: "0s" },
    { x: 96, h: 104, d: "0.2s" },
    { x: 152, h: 150, d: "0.4s" },
    { x: 208, h: 196, d: "0.6s" },
    { x: 264, h: 244, d: "0.8s" },
  ];
  return (
    <div className="animate-float relative mx-auto w-full max-w-[420px]">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 animate-glow rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(143,212,0,0.24), transparent 68%)" }}
      />
      <svg viewBox="0 0 360 320" role="img" aria-label="Croissance et impact mesurable" className="w-full">
        <defs>
          <linearGradient id="limeBar" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#5E9200" />
            <stop offset="1" stopColor="#C6FF00" />
          </linearGradient>
        </defs>

        {/* baseline */}
        <line x1="24" y1="280" x2="336" y2="280" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

        {/* rising bars */}
        {bars.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            width="34"
            rx="7"
            y={280 - b.h}
            height={b.h}
            fill="url(#limeBar)"
            opacity="0.9"
          >
            <animate attributeName="height" values={`0;${b.h}`} dur="1s" begin={b.d} fill="freeze" />
            <animate attributeName="y" values={`280;${280 - b.h}`} dur="1s" begin={b.d} fill="freeze" />
          </rect>
        ))}

        {/* trend line + moving dot */}
        <path
          d="M57 220 L113 176 L169 130 L225 84 L281 40"
          fill="none"
          stroke="#C6FF00"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 7"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-52" dur="2.4s" repeatCount="indefinite" />
        </path>
        <circle r="6" fill="#C6FF00">
          <animateMotion dur="4s" repeatCount="indefinite" path="M57 220 L113 176 L169 130 L225 84 L281 40" />
        </circle>
      </svg>
    </div>
  );
}
