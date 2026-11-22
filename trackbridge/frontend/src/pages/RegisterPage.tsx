import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { Button } from '../components/ui/Button';
import { errMsg } from '../utils/errors';

export function RegisterPage() {
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    studentId: '',
    email: '',
    password: '',
    department: 'Information Technology',
    skills: '',
    interests: '',
  });
  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm({ ...form, [k]: v });
  }
  if (ok) {
    return (
      <div className="mx-auto max-w-lg p-10 card">
        <h1 className="font-serif text-2xl">Registration received</h1>
        <p className="mt-2">A coordinator or administrator must approve your account before you can sign in.</p>
        <Link to="/login" className="mt-4 inline-block text-copper">
          Back to login
        </Link>
      </div>
    );
  }
  return (
    <form
      className="mx-auto max-w-lg space-y-3 p-10"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await authApi.register(form);
          setOk(true);
        } catch (err) {
          setError(errMsg(err));
        }
      }}
    >
      <h1 className="font-serif text-3xl text-pine">Student registration</h1>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {Object.entries({ fullName: 'Full name', studentId: 'Student ID', email: 'Email', password: 'Password', department: 'Department', skills: 'Skills', interests: 'Interests' }).map(
        ([k, label]) => (
          <label key={k} className="block text-sm">
            {label}
            <input
              className="mt-1 w-full rounded border border-sand px-3 py-2"
              type={k === 'password' ? 'password' : 'text'}
              value={(form as Record<string, string>)[k]}
              onChange={(e) => set(k as keyof typeof form, e.target.value)}
              required={['fullName', 'studentId', 'email', 'password', 'department'].includes(k)}
            />
          </label>
        ),
      )}
      <Button type="submit">Submit for approval</Button>
    </form>
  );
}
