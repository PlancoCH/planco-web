import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type'> {
  to?: string;
  variant?: ButtonVariant;
  external?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'group inline-flex items-center gap-3 bg-forest-DEFAULT text-beige-100 font-semibold px-7 py-4 rounded-full bg-forest-400 transition-all duration-300 hover:shadow-xl hover:shadow-forest-DEFAULT/25 active:scale-95',
  secondary:
    'inline-flex items-center gap-2 text-forest-600 font-medium px-7 py-4 rounded-full border border-forest-300 hover:border-forest-DEFAULT hover:text-forest-DEFAULT transition-all duration-300',
  ghost:
    'group inline-flex items-center gap-2 text-forest-DEFAULT font-semibold hover:gap-3 transition-all',
};

export default function Button({
  to,
  variant = 'primary',
  className = '',
  children,
  onClick,
  external = false,
  ...rest
}: ButtonProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (to) {
      if (external) {
        window.location.href = to;
      } else {
        navigate(to);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    onClick?.(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
      {variant !== 'secondary' && (
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      )}
    </button>
  );
}
