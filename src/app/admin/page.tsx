'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('admin_authenticated') === 'true') {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (username === 'Mystic_Sunita' && password === 'Sunita240901') {
        localStorage.setItem('admin_authenticated', 'true');
        router.replace('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-gradient-wine-purple tracking-wider">
            MYSTIC YOGA<sup className="text-gold text-lg">â„¢</sup>
          </h1>
          <p className="text-wine/50 text-sm tracking-widest uppercase mt-2">
            Admin Panel
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-luxury p-8 space-y-6 border border-beige"
        >
          {error && (
            <div className="bg-wine/5 border border-wine/20 text-wine text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-wine/70 mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-beige bg-ivory/50 text-wine placeholder:text-wine/30 focus:outline-none focus:ring-2 focus:ring-wine/30 focus:border-wine transition-colors"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-wine/70 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-beige bg-ivory/50 text-wine placeholder:text-wine/30 focus:outline-none focus:ring-2 focus:ring-wine/30 focus:border-wine transition-colors pr-10"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-wine/40 hover:text-wine/70"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-wine to-purple text-white font-medium hover:bg-wine/90 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>

          <p className="text-xs text-wine/40 text-center pt-2 border-t border-beige">
            Admin auth uses NextAuth. This legacy login is retained for compatibility. Future: migrate to NextAuth admin gate.
          </p>
        </form>
      </div>
    </div>
  );
}
