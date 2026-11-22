const API = '/api/v1';

let accessToken: string | null = localStorage.getItem('tb_access');

export function setToken(token: string | null) {
  accessToken = token;
  if (token) localStorage.setItem('tb_access', token);
  else localStorage.removeItem('tb_access');
}

export function getToken() {
  return accessToken;
}

async function refresh() {
  const res = await fetch(`${API}/auth/refresh`, { method: 'POST', credentials: 'include' });
  if (!res.ok) {
    setToken(null);
    throw new Error('Session expired');
  }
  const data = await res.json();
  setToken(data.accessToken);
  return data;
}

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  let res = await fetch(`${API}${path}`, { ...init, headers, credentials: 'include' });
  if (res.status === 401 && !path.startsWith('/auth/login')) {
    try {
      await refresh();
      headers.set('Authorization', `Bearer ${accessToken}`);
      res = await fetch(`${API}${path}`, { ...init, headers, credentials: 'include' });
    } catch {
      /* fall through */
    }
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: { message: res.statusText } }));
    const err = new Error(body.error?.message || 'Request failed') as Error & { status: number; body: unknown };
    err.status = res.status;
    err.body = body;
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function download(path: string) {
  return fetch(`${API}${path}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    credentials: 'include',
  });
}
