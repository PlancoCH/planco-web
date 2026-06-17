import type { ComponentType } from 'react';

type Icon = ComponentType<{ className?: string }>;

interface ImageCardProps {
  variant: 'vertical' | 'horizontal';
  icon?: Icon;
  image: string;
  imageAlt: string;
  title: string;
  paragraph: string;
  tags?: string[];
  reverse?: boolean;
}

export default function ImageCard({
  variant,
  icon: Icon,
  image,
  imageAlt,
  title,
  paragraph,
  tags,
  reverse = false,
}: ImageCardProps) {
  const isHorizontal = variant === 'horizontal';

  return (
    <div
      className={`group overflow-hidden border border-beige-300 bg-beige-50 hover:border-forest-300 hover:shadow-lg hover:shadow-forest-DEFAULT/10 transition-all duration-300 ${
        isHorizontal
          ? 'grid md:grid-cols-5 rounded-3xl hover:shadow-xl'
          : 'rounded-2xl'
      }`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden ${
          isHorizontal
            ? `md:col-span-2 h-52 md:h-full ${reverse ? 'md:order-2' : ''}`
            : 'h-48'
        }`}
      >
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-forest-900/30" />
      </div>

      {/* Content */}
      <div
        className={`${
          isHorizontal
            ? `md:col-span-3 p-8 md:p-10 flex flex-col justify-center ${reverse ? 'md:order-1' : ''}`
            : 'p-6'
        }`}
      >
        {!isHorizontal && Icon && (
          <div className={`w-10 h-10 bg-forest-DEFAULT/10 rounded-xl flex items-center justify-center ${isHorizontal ? 'mb-0' : 'mb-4'}`}>
            <Icon className="w-5 h-5 text-forest-DEFAULT" />
          </div>
        )}
        {isHorizontal && Icon ? (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-forest-DEFAULT/10 rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5 text-forest-DEFAULT" />
            </div>
            <h3 className="font-serif text-2xl text-forest-800">{title}</h3>
          </div>
        ) : (
          <h3 className={`font-serif text-forest-800 ${isHorizontal ? 'text-3xl mb-1' : 'text-xl mb-2'}`}>
            {title}
          </h3>
        )}
        <p className={`${isHorizontal ? 'text-forest-600' : 'text-forest-500 text-sm'} leading-relaxed ${tags && tags.length > 0 ? 'mb-6' : ''}`}>
          {paragraph}
        </p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-forest-600 bg-forest-DEFAULT/10 px-3 py-1 rounded-full border border-forest-DEFAULT/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
