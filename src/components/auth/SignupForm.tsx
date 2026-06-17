import { useState, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/client';

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSignupSuccess: (email: string) => void;
}

export default function SignupForm({ onSwitchToLogin, onSignupSuccess }: SignupFormProps) {
  const { signup, loading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    clearError();
    try {
      await signup(name, email, password, passwordConfirmation);
      onSignupSuccess(email);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setFieldErrors(err.errors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="signup-name" className="block text-sm font-medium text-forest-700 mb-1.5">
          Name
        </label>
        <input
          id="signup-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm"
        />
        {fieldErrors.name?.map((msg) => (
          <p key={msg} className="text-xs text-red-600 mt-1">{msg}</p>
        ))}
      </div>

      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-forest-700 mb-1.5">
          Email
        </label>
        <input
          id="signup-email"
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
        <label htmlFor="signup-password" className="block text-sm font-medium text-forest-700 mb-1.5">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Minimum 8 characters"
          className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm"
        />
        {fieldErrors.password?.map((msg) => (
          <p key={msg} className="text-xs text-red-600 mt-1">{msg}</p>
        ))}
      </div>

      <div>
        <label htmlFor="signup-password-confirmation" className="block text-sm font-medium text-forest-700 mb-1.5">
          Confirm Password
        </label>
        <input
          id="signup-password-confirmation"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          placeholder="Re-enter your password"
          className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-forest-700 placeholder:text-forest-500/50 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-forest-DEFAULT/20 transition-all text-sm"
        />
        {fieldErrors.password_confirmation?.map((msg) => (
          <p key={msg} className="text-xs text-red-600 mt-1">{msg}</p>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-3 bg-forest-DEFAULT text-beige-100 font-semibold px-7 py-3.5 rounded-full bg-forest-400 transition-all duration-300 hover:shadow-xl hover:shadow-forest-DEFAULT/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-forest-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-forest-DEFAULT font-semibold hover:underline"
        >
          Sign In
        </button>
      </p>
    </form>
  );
}
