export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-sand bg-white px-2 py-0.5 text-xs">
      <span className="font-medium capitalize">{status.replaceAll('_', ' ')}</span>
    </span>
  );
}
