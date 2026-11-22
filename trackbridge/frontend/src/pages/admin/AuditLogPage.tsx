import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';

export function AuditLogPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    adminApi.audit().then((d: { items?: Record<string, unknown>[] } | Record<string, unknown>[]) => {
      setItems(Array.isArray(d) ? d : d.items || []);
    });
  }, []);
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl">Audit log</h1>
      <p className="text-sm">Approvals, role changes, FAQ publish, and placement decisions are recorded.</p>
      <div className="card overflow-auto text-sm">
        {items.map((e, i) => (
          <p key={String(e.id || i)} className="border-b border-sand py-2">
            {String(e.createdAt || '').slice(0, 19)} · {String(e.action)} · {String(e.entityType)} {String(e.entityId || '')}
          </p>
        ))}
      </div>
    </div>
  );
}
