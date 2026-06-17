interface PageContainerProps {
  className?: string;
  children: React.ReactNode;
}

export default function PageContainer({ className, children }: PageContainerProps) {
  return (
    <div className={className + " max-w-6xl mx-auto px-6 py-8"}>
      {children}
    </div>
  );
}
