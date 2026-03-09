"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle 
} from "lucide-react";
import { api, setToken } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email || "test@example.com",
          password: password || "password123",
        }),
      });

      setToken(res.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid email or password";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 selection:bg-indigo-100">
      {/* Logo Link back to Home */}
      <Link 
        href="/" 
        className="flex items-center gap-2 font-bold text-2xl tracking-tight text-indigo-600 mb-10 hover:opacity-80 transition-opacity"
      >
        <CheckCircle2 size={32} strokeWidth={2.5} />
        <span>HabitFlow</span>
      </Link>

      <div className="w-full max-w-[440px]">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-indigo-100/20 p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 mt-2 font-medium">Continue your journey to consistency.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold text-slate-900 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-semibold placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  placeholder="Email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="password" className="text-sm font-bold text-slate-900">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-semibold placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  placeholder="Password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold animate-in fade-in zoom-in-95">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  Log in
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              Don&apos;t have an account?{" "}
              <Link 
                href="/signup" 
                className="text-indigo-600 font-bold hover:underline underline-offset-4"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
        
        {/* Simple Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
          <Link href="/help" className="hover:text-slate-600 transition-colors">Help</Link>
        </div>
      </div>
    </div>
  );
}