import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Button } from '../components/ui/Button';
import { errMsg } from '../utils/errors';

const DEMOS = [
  ['admin@trackbridge.demo', 'Administrator'],
  ['coordinator@trackbridge.demo', 'Coordinator'],
  ['advisor@trackbridge.demo', 'Academic advisor'],
  ['supervisor@trackbridge.demo', 'Internship supervisor'],
  ['host@trackbridge.demo', 'Host organisation'],
  ['student@trackbridge.demo', 'Student'],
];

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('student@trackbridge.demo');
  const [password, setPassword] = useState('TrackBridge!2026');
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto grid min-h-screen max-w-5xl items-center gap-10 px-6 md:grid-cols-2">
      <div>
        <p className="text-sm uppercase tracking-widest text-copper">Jimma University · JIT</p>
        <h1 className="mt-2 font-serif text-4xl text-pine">TrackBridge</h1>
        <p className="mt-4 text-ink/80">
          AI-supported web platform for <strong>CBTP</strong> tracking, internship coordination, and technical project
          management. Matching, summaries and the FAQ bot are advisory — authorised staff keep the decisions.
        </p>
      </div>
      <form
        className="card space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          try {
            await login(email, password);
            nav('/dashboard');
          } catch (err) {
            setError(errMsg(err));
          }
        }}
      >
        <h2 className="font-serif text-2xl">Sign in</h2>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <label className="block text-sm">
          Email
          <input className="mt-1 w-full rounded border border-sand px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm">
          Password
          <input type="password" className="mt-1 w-full rounded border border-sand px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <Button type="submit">Enter</Button>
        <p className="text-sm">
          <Link className="text-copper" to="/register">
            Student registration
          </Link>
          {' · '}
          <Link className="text-copper" to="/forgot-password">
            Forgot password
          </Link>
        </p>
        <div className="text-xs text-ink/70">
          Demo password for all roles: <code>TrackBridge!2026</code>
          <ul className="mt-2 space-y-1">
            {DEMOS.map(([e, r]) => (
              <li key={e}>
                <button type="button" className="text-left text-pine underline" onClick={() => setEmail(e)}>
                  {r}: {e}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  );
}
