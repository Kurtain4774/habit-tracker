"use client";

import Link from "next/link";
import { CheckCircle2, ArrowLeft, ShieldCheck, Eye, Lock, Globe } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 selection:bg-indigo-100">
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-12">
          <Link href="/login" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors">
            <ArrowLeft size={20} />
            Back to Login
          </Link>
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <CheckCircle2 size={24} strokeWidth={2.5} />
            <span>HabitFlow</span>
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-indigo-100/20 p-8 md:p-12">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
            <p className="text-slate-500 mt-3 font-medium">Last updated: March 2024</p>
          </header>

          <div className="space-y-10 text-slate-600 leading-relaxed">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900">
                <ShieldCheck className="text-indigo-600" size={24} />
                <h2 className="text-xl font-bold">Your Data Privacy</h2>
              </div>
              <p>At HabitFlow, we believe your habits are your business. We collect minimal data necessary to provide a seamless experience and never sell your personal information to third parties.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Account Data:</strong> Email address and name provided during signup.</li>
                <li><strong>Usage Data:</strong> Habit completion logs, streaks, and timestamps.</li>
                <li><strong>Technical Data:</strong> IP address and browser type for security purposes.</li>
              </ul>
            </section>

            <div className="grid md:grid-cols-2 gap-6 py-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <Eye className="text-indigo-600 mb-3" size={24} />
                <h3 className="font-bold text-slate-900">Transparency</h3>
                <p className="text-sm mt-1">We are clear about what data we use and why we use it.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <Lock className="text-indigo-600 mb-3" size={24} />
                <h3 className="font-bold text-slate-900">Security</h3>
                <p className="text-sm mt-1">Industry-standard encryption keeps your data safe.</p>
              </div>
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at <span className="text-indigo-600 font-bold">privacy@habitflow.com</span>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}