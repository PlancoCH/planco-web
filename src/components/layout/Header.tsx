import { useNavigate } from 'react-router-dom';
import { CircleUserRound } from 'lucide-react';
import Logo from '../ui/Logo';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-beige-100/95 backdrop-blur-md border-b border-beige-300">
      <div className="h-full max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Logo variant="light" clickable />
        <button
          onClick={() => { navigate('/account'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="w-9 h-9 rounded-full border border-beige-300 flex items-center justify-center text-forest-600 hover:text-forest-DEFAULT hover:border-forest-300 transition-all duration-300"
          aria-label="Account settings"
        >
          <CircleUserRound className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
