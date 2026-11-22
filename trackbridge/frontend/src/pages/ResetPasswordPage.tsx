import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { Button } from '../components/ui/Button';

export function ResetPasswordPage() {
  const [sp] = useSearchParams();
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  return (
    <form
      className="mx-auto mt-16 max-w-md space-y-3 p-10 card"
      onSubmit={async (e) => {
        e.preventDefault();
        await authApi.reset(sp.get('token') || '', password);
        setDone(true);
      }}
    >
      <h1 className="font-serif text-2xl">New password</h1>
      {done ? (
        <p>Password updated. You can sign in.</p>
      ) : (
        <>
          <input type="password" className="w-full rounded border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit">Save</Button>
        </>
      )}
    </form>
  );
}
