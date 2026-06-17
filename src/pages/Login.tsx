import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/ui/Logo';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import VerificationModal from '../components/auth/VerificationModal';

type Mode = 'login' | 'signup';

export default function Login() {
  const { resendVerificationEmail } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [modalEmail, setModalEmail] = useState<string | null>(null);

  const showModal = (email: string) => setModalEmail(email);
  const hideModal = () => setModalEmail(null);

  return (
    <div className="min-h-screen bg-beige-100 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-10">
          <Logo variant="light" />
        </div>

        <div className="bg-beige-50 rounded-2xl border border-beige-300 p-8 shadow-sm">
          <div className="text-center mb-7">
            <h1 className="font-serif text-2xl text-forest-800 mb-1.5">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-forest-500 text-sm">
              {mode === 'login'
                ? 'Sign in to your Planco account'
                : 'Start monitoring your plants today'}
            </p>
          </div>

          {mode === 'login' ? (
            <LoginForm
              onSwitchToSignup={() => setMode('signup')}
              onVerificationNeeded={showModal}
            />
          ) : (
            <SignupForm
              onSwitchToLogin={() => setMode('login')}
              onSignupSuccess={showModal}
            />
          )}
        </div>
      </div>

      {modalEmail !== null && (
        <VerificationModal
          email={modalEmail}
          onResend={() => resendVerificationEmail(modalEmail)}
          onClose={hideModal}
        />
      )}
    </div>
  );
}
