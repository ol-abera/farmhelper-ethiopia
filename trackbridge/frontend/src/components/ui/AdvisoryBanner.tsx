import type { ReactNode } from 'react';

export function AdvisoryBanner({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 rounded-lg border border-copper/40 bg-copper/10 px-3 py-2 text-sm text-ink">
      <strong className="text-copper">Advisory.</strong> {children}
    </div>
  );
}
