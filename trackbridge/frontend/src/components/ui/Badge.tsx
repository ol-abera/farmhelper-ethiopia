export function Badge({ children }: { children: string }) {
  return <span className="rounded-full bg-sand px-2 py-0.5 text-xs font-medium text-ink">{children}</span>;
}
