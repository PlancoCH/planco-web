import { useState, type ReactNode } from 'react';
import Prompt from '../ui/Prompt';

interface EmailVerificationPromptProps {
  heading?: string;
  message: ReactNode;
  onResend: () => Promise<void>;
  children?: ReactNode;
}

function MailIcon() {
  return (
    <svg className="w-6 h-6 text-forest-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

export default function EmailVerificationPrompt({
  heading,
  message,
  onResend,
  children,
}: EmailVerificationPromptProps) {
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      await onResend();
    } finally {
      setResending(false);
    }
  };

  return (
    <Prompt icon={<MailIcon />} heading={heading} message={message}>
      <button
        type="button"
        onClick={handleResend}
        disabled={resending}
        className="inline-flex items-center gap-2 text-forest-600 font-medium px-6 py-3 rounded-full border border-forest-300 hover:border-forest-DEFAULT hover:text-forest-DEFAULT transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {resending ? 'Sending...' : 'Resend verification email'}
      </button>
      {children}
    </Prompt>
  );
}
