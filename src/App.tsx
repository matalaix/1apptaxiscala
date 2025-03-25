import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import Layout from './components/Layout';
import AuthForm from './components/AuthForm';
import Home from './pages/Home';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      {!session ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <AuthForm />
        </div>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </BrowserRouter>
  );
}

export default App