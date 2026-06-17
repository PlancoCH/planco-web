import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

type LogoVariant = 'light' | 'dark';

interface LogoProps {
  variant?: LogoVariant;
  clickable?: boolean;
  className?: string;
}

const variants: Record<LogoVariant, { iconBg: string; iconColor: string; textColor: string; hoverBg: string }> = {
  light: {
    iconBg: 'bg-sage-400',
    iconColor: 'text-forest-800',
    textColor: 'text-forest-700',
    hoverBg: 'group-hover:bg-forest-400',
  },
  dark: {
    iconBg: 'bg-sage-400',
    iconColor: 'text-forest-800',
    textColor: 'text-beige-100',
    hoverBg: 'group-hover:bg-sage-300',
  },
};

export default function Logo({ variant = 'light', clickable = false, className = '' }: LogoProps) {
  const navigate = useNavigate();
  const v = variants[variant];

  const content = (
    <div className={`flex items-center gap-2 ${clickable ? 'group' : ''} ${className}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${v.iconBg} ${clickable ? v.hoverBg : ''}`}>
        <Leaf className={`w-4 h-4 ${v.iconColor}`} />
      </div>
      <span className={`font-serif text-xl font-semibold tracking-tight ${v.textColor}`}>
        Planco
      </span>
    </div>
  );

  if (clickable) {
    return (
      <button
        type="button"
        onClick={() => {
          navigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        {content}
      </button>
    );
  }

  return content;
}
