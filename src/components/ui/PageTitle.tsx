interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <section className="text-center mb-12">
      <h1 className="font-serif text-4xl md:text-5xl text-forest-800 mb-4">
        {title}
      </h1>
      <p className="text-forest-500 text-lg max-w-md mx-auto leading-relaxed">
        {subtitle}
      </p>
    </section>
  );
}
