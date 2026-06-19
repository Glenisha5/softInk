import React, { useState } from 'react';

interface LoginProps {
  onLogin: (token: string, username: string) => void;
}

const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [screen, setScreen] = useState<'choice' | 'email' | 'google'>('choice');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [socialName, setSocialName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister ? { username, email, password } : { email, password };
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      onLogin(data.token, data.username);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    setError('');

    if (provider === 'microsoft') {
      setError('Microsoft sign-in is not configured yet. Add Azure app credentials to enable it.');
      return;
    }

    if (!email.trim()) {
      setError('Enter your Gmail address first.');
      return;
    }

    setLoading(true);
    try {
      const displayName = socialName.trim() || username.trim() || email.split('@')[0];
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: displayName,
          googleId: email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google sign-in failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      onLogin(data.token, data.username);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[linear-gradient(180deg,#f8f7f3_0%,#ffffff_55%,#f7f4ef_100%)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-serif-heading text-neutral-800 mb-2">
            {screen === 'choice' ? 'Welcome back' : screen === 'google' ? 'Continue with Google' : isRegister ? 'Create account' : 'Sign in'}
          </h2>
          <p className="text-neutral-500 italic">
            {screen === 'choice'
              ? 'Choose how you want to enter the library'
              : screen === 'google'
                ? 'Use your Gmail address to continue'
                : isRegister
                  ? 'Join to read the poems'
                  : 'Sign in to read the poems'}
          </p>
        </div>

        <div className="bg-white border border-neutral-100 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.06)] p-8 flex flex-col gap-4">
          {screen === 'choice' && (
            <>
              <button
                onClick={() => setScreen('google')}
                className="w-full rounded-xl border border-blue-400 bg-white px-4 py-3.5 text-sm text-neutral-800 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <span className="inline-flex items-center justify-center gap-3">
                  <span className="text-xl leading-none">G</span>
                  <span>Continue with Google</span>
                </span>
              </button>

              <div className="flex items-center gap-4 py-1">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">Or</span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>

              <button
                onClick={() => setScreen('email')}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm text-white shadow-[0_10px_24px_rgba(79,70,229,0.28)] transition-transform hover:-translate-y-0.5"
              >
                Continue with Email
              </button>

              <div className="text-center text-sm text-neutral-500 pt-3">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setScreen('email');
                    setIsRegister(false);
                  }}
                  className="font-semibold text-indigo-600 underline decoration-indigo-300 underline-offset-2"
                >
                  Log in
                </button>
              </div>
            </>
          )}

          {screen === 'google' && (
            <>
              <p className="text-sm text-neutral-500 leading-relaxed text-center">
                Use a Gmail address to continue. This project is wired for email-based Google sign-in rather than a full OAuth popup yet.
              </p>
              <input
                type="text"
                placeholder="Display name"
                value={socialName}
                onChange={e => setSocialName(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
              />
              <input
                type="email"
                placeholder="Gmail address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="w-full rounded-xl bg-neutral-800 px-4 py-3 text-sm uppercase tracking-widest text-white hover:bg-neutral-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Please wait...' : 'Continue with Google'}
              </button>
              <button
                onClick={() => setScreen('choice')}
                className="w-full text-sm text-neutral-500 underline underline-offset-4"
              >
                Back
              </button>
            </>
          )}

          {screen === 'email' && (
            <>
              {isRegister && (
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-xl bg-neutral-800 px-4 py-3 text-sm uppercase tracking-widest text-white hover:bg-neutral-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Please wait...' : isRegister ? 'Register' : 'Sign in'}
              </button>

              <button
                onClick={() => {
                  setScreen('choice');
                  setError('');
                }}
                className="text-sm text-neutral-500 underline underline-offset-4"
              >
                Back to options
              </button>

              <div className="text-center text-sm text-neutral-500 pt-2">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="font-semibold text-indigo-600 underline decoration-indigo-300 underline-offset-2"
                >
                  {isRegister ? 'Log in' : 'Register'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};