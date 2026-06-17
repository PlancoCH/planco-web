import type { ComponentType } from 'react';

type Icon = ComponentType<{ className?: string }>;

interface FeatureCardProps {
  icon: Icon;
  title: string;
  description: string;
  className?: string;
}

export default function FeatureCard({ icon: Icon, title, description, className = '' }: FeatureCardProps) {
  return (
    <div
      className={`bg-beige-50 rounded-2xl border border-beige-300 p-8 hover:border-forest-300 hover:shadow-lg hover:shadow-forest-DEFAULT/10 transition-all duration-300 ${className}`}
    >
      <div className="w-12 h-12 bg-forest-DEFAULT/10 rounded-xl flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-forest-DEFAULT" />
      </div>
      <h3 className="font-serif text-xl text-forest-800 mb-3">{title}</h3>
      <p className="text-forest-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
