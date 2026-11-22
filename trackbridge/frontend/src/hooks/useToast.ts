import { useState } from 'react';
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  return { msg, show: (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 4000); } };
}
