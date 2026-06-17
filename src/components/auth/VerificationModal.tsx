import EmailVerificationPrompt from './EmailVerificationPrompt';
import { X } from 'lucide-react';

interface VerificationModalProps {
  email: string;
  onResend: () => Promise<void>;
  onClose: () => void;
}

export default function VerificationModal({ email, onResend, onClose }: VerificationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-forest-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-beige-50 rounded-2xl border border-beige-300 shadow-xl p-8 w-full max-w-sm animate-fade-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-forest-400 hover:text-forest-700 hover:bg-beige-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <EmailVerificationPrompt
          heading="Check your email"
          message={<>We've sent a verification link to <span className="font-medium text-forest-700">{email}</span>. Please check your inbox and click the link to verify your email address.</>}
          onResend={onResend}
        />
      </div>
    </div>
  );
}
