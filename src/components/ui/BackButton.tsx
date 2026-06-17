import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string;
  text?: string;
}

export default function BackButton({
  to,
  text = 'Back to last page',
}: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="inline-flex items-center gap-2 text-forest-500 hover:text-forest-700 text-sm mb-6 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      {text}
    </button>
  );
}