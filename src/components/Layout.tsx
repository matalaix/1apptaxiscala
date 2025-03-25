import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Clock, LogOut, LayoutDashboard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const checkIfAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(user?.email === 'xenons8826@gmail.com');
    };
    checkIfAdmin();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-2 py-2 text-gray-900">
                <span className="text-xl font-bold">TaxiBook</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`flex items-center px-3 py-2 rounded-lg ${
                  location.pathname === '/'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Home size={20} className="mr-2" />
                <span>Home</span>
              </Link>
              <Link
                to="/bookings"
                className={`flex items-center px-3 py-2 rounded-lg ${
                  location.pathname === '/bookings'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Clock size={20} className="mr-2" />
                <span>My Bookings</span>
              </Link>
              <Link
                to="/profile"
                className={`flex items-center px-3 py-2 rounded-lg ${
                  location.pathname === '/profile'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User size={20} className="mr-2" />
                <span>Profile</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    location.pathname === '/admin'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard size={20} className="mr-2" />
                  <span>Admin</span>
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <LogOut size={20} className="mr-2" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}