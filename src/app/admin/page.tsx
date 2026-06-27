'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authed = localStorage.getItem('admin_authenticated') === 'true';
    const hasCookie = document.cookie.split(';').some((c) => c.trim().startsWith('admin_session='));
    if (authed || hasCookie) {
      router.replace('/admin/dashboard');
    } else {
      setLoading(false);
    }
  }, [router]);

  const setSessionCookie = () => {
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    document.cookie = `admin_session=${expiresAt};path=/;max-age=86400;SameSite=Lax;Secure`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email/username and password.');
      return;
    }

    const validEmail = email === 'Mystic_Sunita' || email.toLowerCase() === 'admin@mysticyoga.global';
    if (validEmail && password === 'Sunita240901') {
      localStorage.setItem('admin_authenticated', 'true');
      setSessionCookie();
      setTimeout(() => router.replace('/admin/dashboard'), 100);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-gradient-wine-purple tracking-wider">
            MYSTIC YOGA<sup className="text-gold text-lg">™</sup>
          </h1>
          <p className="text-wine/50 text-sm tracking-widest uppercase mt-2">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-luxury p-8 space-y-6 border border-beige">
          {error && (
            <div className="bg-wine/5 border border-wine/20 text-wine text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-wine/70 mb-1.5">Email / Username</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-wine/30" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-beige bg-ivory/50 text-wine placeholder:text-wine/30 focus:outline-none focus:ring-2 focus:ring-wine/30 focus:border-wine transition-colors"
                placeholder="Enter email or username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-wine/70 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-wine/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-beige bg-ivory/50 text-wine placeholder:text-wine/30 focus:outline-none focus:ring-2 focus:ring-wine/30 focus:border-wine transition-colors"
                placeholder="Enter password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-wine/40 hover:text-wine/70">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-wine to-purple text-white font-medium hover:brightness-110 transition-all disabled:opacity-60"
          >
            <LogIn size={18} />
            <span>Sign In</span>
          </button>

          <div className="text-center">
            <Link href="/admin/forgot-password" className="text-xs text-wine/50 hover:text-wine transition-colors">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
