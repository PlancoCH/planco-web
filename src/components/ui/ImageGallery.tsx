interface GalleryImage {
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <section className="py-24 bg-beige-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map(({ src, alt }) => (
            <div
              key={src}
              className="group relative overflow-hidden rounded-2xl border border-beige-300 hover:border-forest-300 hover:shadow-xl hover:shadow-forest-DEFAULT/10 transition-all duration-500"
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-beige-100 text-sm font-medium leading-snug">{alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
