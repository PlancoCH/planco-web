import { useState, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/client';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const { signup, resendVerificationEmail, loading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    clearError();
    setSignupSuccess(false);
    try {
      await signup(name, email, password, passwordConfirmation);
      setSignupSuccess(true);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setFieldErrors(err.errors);
      }
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerificationEmail(email);
    } finally {
      setResending(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="text-center space-y-5">
        <div className="w-14 h-14 bg-forest-DEFAULT/10 rounded-xl flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-forest-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-serif text-xl text-forest-800 mb-2">Check your email</h3>
          <p className="text-forest-500 text-sm leading-relaxed">
            We've sent a verification link to <span className="font-medium text-forest-700">{email}</span>.
            Please verify your email address before signing in.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-sm text-forest-DEFAULT font-semibold hover:underline disabled:opacity-50"
        >
          {resending ? 'Sending...' : 'Resend verification email'}
        </button>
        <p className="text-sm text-forest-500">
          Already verified?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-forest-DEFAULT font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    );
  }

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
