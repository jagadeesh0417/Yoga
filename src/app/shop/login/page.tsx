"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { shopApi } from "@/lib/shop-api";
import MagneticButton from "@/components/animations/MagneticButton";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await shopApi.login(email, password);
      localStorage.setItem("shop_token", res.token);
      const redirect = searchParams.get("redirect") || "/shop";
      router.push(redirect);
    } catch {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto px-4"
      >
        <div className="glass-light rounded-3xl overflow-hidden shadow-wine">
          <div className="gradient-primary p-8 text-center">
            <h1 className="font-serif text-2xl font-bold text-ivory">Welcome Back</h1>
            <p className="text-ivory/60 text-sm mt-1">Sign in to your MYSTIC YOGA account</p>
          </div>

          <form onSubmit={handleLogin} className="p-6 md:p-8 space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-rose border border-wine/10 text-sm text-wine">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-wine/30" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/70 border border-wine/10 text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-wine/30" />
                <input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/70 border border-wine/10 text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-wine/30 hover:text-wine/50 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <MagneticButton>
              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-medium text-sm shadow-lg shadow-wine/20 hover:shadow-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <LogIn className="w-4 h-4" />
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </MagneticButton>

            <p className="text-center text-sm text-wine/50">
              Don&apos;t have an account?{" "}
              <Link href="/shop/register" className="text-purple hover:text-wine font-medium transition-colors">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-wine border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
