export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="card text-center">
      <p className="font-serif text-lg text-pine">{title}</p>
      <p className="mt-1 text-sm text-ink/70">{hint}</p>
    </div>
  );
}
