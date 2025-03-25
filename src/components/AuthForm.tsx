import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { LogIn, UserPlus } from 'lucide-react';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [lastAttempt, setLastAttempt] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting check
    const now = Date.now();
    if (now - lastAttempt < 60000) { // 60 seconds cooldown
      toast.error('Please wait a minute before trying again');
      return;
    }

    setLoading(true);
    setLastAttempt(now);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: email.trim(),
          password 
        });
        if (error) throw error;
        toast.success('Welcome back!');
      } else {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        const { error } = await supabase.auth.signUp({ 
          email: email.trim(),
          password,
          options: {
            data: {
              email: email.trim()
            },
            emailRedirectTo: window.location.origin,
            // Disable email confirmation
            emailConfirmation: false
          }
        });
        if (error) throw error;
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      let message = error.message;
      if (message.includes('invalid_credentials')) {
        message = 'Invalid email or password';
      } else if (message.includes('over_email_send_rate_limit')) {
        message = 'Please wait before trying again';
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            minLength={6}
          />
          {!isLogin && (
            <p className="mt-2 text-sm text-gray-500">
              Password must be at least 6 characters long
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            'Please wait...'
          ) : isLogin ? (
            <>
              <LogIn size={20} /> Sign In
            </>
          ) : (
            <>
              <UserPlus size={20} /> Sign Up
            </>
          )}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 font-medium hover:underline"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  );
}