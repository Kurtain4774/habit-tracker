"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  Mail, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  Send
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 selection:bg-indigo-100">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-indigo-600 mb-8 hover:opacity-80 transition-opacity">
        <CheckCircle2 size={32} strokeWidth={2.5} />
        <span>HabitFlow</span>
      </Link>

      <div className="w-full max-w-[440px]">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-indigo-100/20 p-8 md:p-12">
          
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reset Password</h1>
                <p className="text-slate-600 mt-2 font-medium">
                  Enter your email and we&apos;ll send you a link to get back into your account.
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-1.5">
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
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-semibold focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
                      placeholder="hello@habitflow.com"
                    />
                  </div>
                </div>

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
                  {loading ? <Loader2 className="animate-spin" size={22} /> : (
                    <>
                      Send Reset Link
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Check your email</h2>
              <p className="text-slate-600 font-medium mb-8">
                We&apos;ve sent a password reset link to <br />
                <span className="text-slate-900 font-bold">{email}</span>
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
              >
                Didn&apos;t get the email? Try again
              </button>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}