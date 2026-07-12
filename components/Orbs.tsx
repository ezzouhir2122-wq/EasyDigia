/** Decorative animated background orbs (brand glow). Purely visual. */
export function Orbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="animate-orb absolute -right-40 -top-52 h-[600px] w-[600px] rounded-full blur-[12px]"
        style={{
          background:
            "radial-gradient(circle, rgba(143,212,0,0.22) 0%, rgba(143,212,0,0) 70%)",
        }}
      />
      <div
        className="animate-orb-slow absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full blur-[14px]"
        style={{
          background:
            "radial-gradient(circle, rgba(198,255,0,0.14) 0%, rgba(198,255,0,0) 70%)",
        }}
      />
    </div>
  );
}
