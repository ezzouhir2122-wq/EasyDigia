export function ServiceCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: string;
}) {
  return (
    <div className="group rounded-[18px] border border-white/10 bg-surface p-6 transition hover:border-brand/40 hover:shadow-[0_10px_40px_rgba(143,212,0,0.08)]">
      {icon && (
        <div className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-[13px] bg-brand/10 text-2xl transition group-hover:bg-brand/20">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-[15px] leading-[1.6] text-muted">{description}</p>
    </div>
  );
}
