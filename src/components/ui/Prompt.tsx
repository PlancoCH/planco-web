import type { ReactNode } from 'react';

interface PromptProps {
  icon?: ReactNode;
  heading?: string;
  message?: ReactNode;
  children?: ReactNode;
}

export default function Prompt({ icon, heading, message, children }: PromptProps) {
  return (
    <div className="text-center space-y-4">
      {icon && (
        <div className="w-12 h-12 bg-forest-DEFAULT/10 rounded-xl flex items-center justify-center mx-auto">
          {icon}
        </div>
      )}
      <div>
        {heading && (
          <h3 className="font-serif text-xl text-forest-800 mb-2">{heading}</h3>
        )}
        {message && (
          <div className="text-forest-500 text-sm leading-relaxed">
            {message}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
