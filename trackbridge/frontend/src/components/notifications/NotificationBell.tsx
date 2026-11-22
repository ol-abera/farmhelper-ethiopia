import { useEffect, useState } from 'react';
import { commsApi } from '../../api/communications.api';

export function NotificationBell() {
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    commsApi.notifications().then((d: { unread: number }) => setUnread(d.unread)).catch(() => undefined);
  }, []);
  return (
    <span className="relative text-sm">
      Notices
      {unread > 0 && (
        <span className="ml-1 rounded-full bg-copper px-1.5 text-xs text-white">{unread}</span>
      )}
    </span>
  );
}
