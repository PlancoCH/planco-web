import Logo from '../ui/Logo';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-beige-100/95 backdrop-blur-md border-b border-beige-300">
      <div className="h-full max-w-6xl mx-auto px-6 flex items-center">
        <Logo variant="light" />
      </div>
    </header>
  );
}
