import { useState } from 'react';
import { authApi } from '../api/auth.api';
import { Button } from '../components/ui/Button';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <form
      className="mx-auto max-w-md space-y-3 p-10 card mt-16"
      onSubmit={async (e) => {
        e.preventDefault();
        await authApi.forgot(email);
        setDone(true);
      }}
    >
      <h1 className="font-serif text-2xl">Reset password</h1>
      {done ? (
        <p>If the account exists, a reset email was queued (console in development).</p>
      ) : (
        <>
          <input className="w-full rounded border border-sand px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <Button type="submit">Send link</Button>
        </>
      )}
    </form>
  );
}
