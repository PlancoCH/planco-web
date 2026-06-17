import { useState, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/client';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    clearError();
    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setFieldErrors(err.errors);
      }
    }
  };

  const isEmailUnverified = error === 'Email address not verified';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-forest-700 mb-1.5">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm"
        />
        {fieldErrors.email?.map((msg) => (
          <p key={msg} className="text-xs text-red-600 mt-1">{msg}</p>
        ))}
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-forest-700 mb-1.5">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
          className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm"
        />
        {fieldErrors.password?.map((msg) => (
          <p key={msg} className="text-xs text-red-600 mt-1">{msg}</p>
        ))}
      </div>

      {error && !isEmailUnverified && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isEmailUnverified && (
        <div className="bg-beige-50 border border-beige-300 rounded-xl px-4 py-3">
          <p className="text-sm text-forest-600">
            Your email address is not yet verified. Please check your inbox for the verification link.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-3 bg-forest-DEFAULT text-beige-100 font-semibold px-7 py-3.5 rounded-full bg-forest-400 transition-all duration-300 hover:shadow-xl hover:shadow-forest-DEFAULT/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-center text-sm text-forest-500">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-forest-DEFAULT font-semibold hover:underline"
        >
          Sign Up
        </button>
      </p>
    </form>
  );
}
