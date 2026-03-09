"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Sparkles
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Professional Password Strength Logic
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1; // Length check
    if (/[A-Z]/.test(password)) score += 1; // Uppercase check
    if (/[0-9]/.test(password)) score += 1; // Number check
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special char check
    return score;
  }, [password]);

  // Dynamic color mapping for the strength meter
  const getStrengthColor = (step: number) => {
    if (passwordStrength < step) return "bg-slate-100";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-orange-400";
    if (passwordStrength === 3) return "bg-yellow-400";
    return "bg-emerald-500"; // Full strength Green
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      // Redirect to login after successful signup
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 selection:bg-indigo-100">
      {/* Brand Identity */}
      <Link 
        href="/" 
        className="flex items-center gap-2 font-bold text-2xl tracking-tight text-indigo-600 mb-8 hover:opacity-80 transition-opacity"
      >
        <CheckCircle2 size={32} strokeWidth={2.5} />
        <span>HabitFlow</span>
      </Link>

      <div className="w-full max-w-[480px]">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-indigo-100/20 p-8 md:p-12">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
              <Sparkles size={14} />
              Start Your Flow
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your account</h1>
            <p className="text-slate-600 mt-2 font-medium">Build a better you, one day at a time.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-bold text-slate-900 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-semibold focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
                  placeholder="Name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-bold text-slate-900 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-semibold focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
                  placeholder="Email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-bold text-slate-900 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-semibold focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
                  placeholder="Min. 8 characters"
                />
              </div>
              
              {/* Strength Indicator */}
              <div className="flex flex-col gap-2 mt-2 px-1">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step} 
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-all duration-500",
                        getStrengthColor(step)
                      )} 
                    />
                  ))}
                </div>
                {passwordStrength > 0 && (
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-wider transition-colors",
                    passwordStrength === 4 ? "text-emerald-600" : "text-slate-400"
                  )}>
                    {passwordStrength === 1 && "Weak"}
                    {passwordStrength === 2 && "Fair"}
                    {passwordStrength === 3 && "Good"}
                    {passwordStrength === 4 && "Strong & Secure"}
                  </p>
                )}
              </div>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold animate-in fade-in zoom-in-95">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 active:scale-[0.98] mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600 font-medium">
              Already a member?{" "}
              <Link 
                href="/login" 
                className="text-indigo-600 font-bold hover:underline underline-offset-4 transition-all"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}