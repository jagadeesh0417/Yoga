'use client';

import { useState } from 'react';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import Link from 'next/link';

const WA_ADMIN = "https://wa.me/919164081909?text=I%20need%20help%20resetting%20my%20admin%20password";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-gradient-wine-purple tracking-wider">
            MYSTIC YOGA<sup className="text-gold text-lg">™</sup>
          </h1>
          <p className="text-wine/50 text-sm tracking-widest uppercase mt-2">Reset Password</p>
        </div>

        <div className="bg-white rounded-2xl shadow-luxury p-8 border border-beige">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center">
                <Send className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-wine font-medium">Reset link sent!</p>
              <p className="text-sm text-wine/50">
                If the email <strong className="text-wine">{email}</strong> is registered, you will receive password reset instructions shortly.
              </p>
              <p className="text-xs text-wine/40 mt-4">
                Alternatively, contact support via{' '}
                <a href={WA_ADMIN} target="_blank" rel="noopener noreferrer" className="text-purple hover:text-wine underline">WhatsApp</a>.
              </p>
              <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-purple hover:text-wine transition-colors mt-4">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-wine/60">Enter your email or username and we'll send you a reset link.</p>
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
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-wine to-purple text-white font-medium hover:brightness-110 transition-all"
              >
                <Send size={18} />
                <span>Send Reset Link</span>
              </button>
              <div className="text-center">
                <Link href="/admin" className="inline-flex items-center gap-2 text-xs text-wine/50 hover:text-wine transition-colors">
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
