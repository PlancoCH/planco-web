import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Flower2, MonitorCog } from 'lucide-react';

interface NavItem {
  path: string;
  icon: typeof Home;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/plants', icon: Flower2, label: 'Plants' },
  { path: '/devices', icon: MonitorCog, label: 'Devices' },

];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-beige-100/95 backdrop-blur-md border-t border-beige-300">
      <nav className="h-full max-w-6xl mx-auto px-6 flex items-center justify-around">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              type="button"
              onClick={() => {
                navigate(path);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center gap-0.5 min-w-0 px-4 py-1 transition-colors ${
                isActive ? 'text-forest-DEFAULT' : 'text-forest-500 hover:text-forest-DEFAULT'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
              {isActive && <div className="absolute bottom-0 w-8 h-0.5 bg-forest-DEFAULT rounded-full" />}
            </button>
          );
        })}
      </nav>
    </footer>
  );
}
