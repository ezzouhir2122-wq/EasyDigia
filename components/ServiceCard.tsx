export function ServiceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white/5 p-6">
      <h3 className="font-heading text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-ink/70">{description}</p>
    </div>
  );
}
