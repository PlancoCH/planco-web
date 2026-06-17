import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Account from './pages/Account';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Devices from './pages/Devices';
import Plants from './pages/Plants';
import PageTransition from './components/transitions/PageTransition';

function AppShell() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-forest-DEFAULT border-t-transparent rounded-full animate-spin" />
          <p className="text-forest-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-beige-100">
      <Header />
      <main className="pt-16 pb-16 min-h-[calc(100vh-8rem)] overflow-hidden">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/devices" element={<PageTransition><Devices /></PageTransition>} />
            <Route path="/plants" element={<PageTransition><Plants /></PageTransition>} />
            <Route path="/account" element={<PageTransition><Account /></PageTransition>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
