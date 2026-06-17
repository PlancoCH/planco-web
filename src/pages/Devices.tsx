import { useAuth } from '../context/AuthContext';

export default function Devices() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <section className="text-center">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-forest-DEFAULT bg-forest-DEFAULT/10 px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-DEFAULT animate-pulse" />
          Your Greenhouse
        </span>

        <h1 className="font-serif text-4xl md:text-5xl text-forest-800 mb-4">
          Welcome, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-forest-500 text-lg max-w-md mx-auto leading-relaxed">
          Your plants are waiting. Connect a device to start monitoring your greenhouse.
        </p>
      </section>
    </div>
  );
}
