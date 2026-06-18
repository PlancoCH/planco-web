import { useState, type ReactNode, type ComponentType } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon?: ComponentType<{ className?: string }>;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export default function CollapsibleSection({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
  className = '',
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`bg-beige-50 rounded-2xl border border-beige-300 shadow-sm overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left hover:bg-beige-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-forest-DEFAULT/10 flex items-center justify-center shrink-0">
              <Icon className="w-4.5 h-4.5 text-forest-DEFAULT" />
            </div>
          )}
          <h3 className="font-serif text-lg text-forest-800">{title}</h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-forest-400 transition-transform duration-300 shrink-0 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
