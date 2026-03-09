"use client";

import Link from "next/link";
import { CheckCircle2, ArrowLeft, MessageSquare, BookOpen, Zap, Mail } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    { q: "How do I reset my streak?", a: "Streaks are calculated automatically based on your daily completions." },
    { q: "Can I use HabitFlow offline?", a: "Yes! Your changes will sync once you are back online." },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 selection:bg-indigo-100">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-indigo-600 mb-6">
            <CheckCircle2 size={32} strokeWidth={2.5} />
            <span>HabitFlow</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">How can we help?</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-lg shadow-indigo-100/20">
            <BookOpen className="text-indigo-600 mb-4" size={28} />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Guides</h2>
            <p className="text-slate-500 text-sm mb-6">Learn how to build lasting habits with our deep-dive tutorials.</p>
            <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Browse Guides <Zap size={16} />
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-lg shadow-indigo-100/20">
            <MessageSquare className="text-indigo-600 mb-4" size={28} />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Support</h2>
            <p className="text-slate-500 text-sm mb-6">Can&apos;t find what you&apos;re looking for? Our team is here to help.</p>
            <a href="mailto:support@habitflow.com" className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Contact Us <Mail size={16} />
            </a>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/login" className="text-slate-500 font-bold hover:text-indigo-600 transition-colors">
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}