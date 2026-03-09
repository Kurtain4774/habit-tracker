"use client";

import Link from "next/link";
import { CheckCircle2, ArrowLeft, Scale, FileText } from "lucide-react";

export default function TermsPage() {
  const sections = [
    { title: "1. Acceptance", content: "By accessing HabitFlow, you agree to be bound by these terms and all applicable laws." },
    { title: "2. User Conduct", content: "You are responsible for maintaining the security of your account and password." },
    { title: "3. Subscription", content: "Certain features require a paid subscription. All fees are non-refundable unless required by law." },
    { title: "4. Termination", content: "We reserve the right to suspend accounts that violate our community guidelines." }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 selection:bg-indigo-100">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <Link href="/login" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors">
            <ArrowLeft size={20} />
            Back
          </Link>
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <CheckCircle2 size={24} strokeWidth={2.5} />
            <span>HabitFlow</span>
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-indigo-100/20 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Scale className="text-indigo-600" size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
          </div>

          <p className="text-slate-500 mb-10 font-medium">Please read these terms carefully before using our service.</p>

          <div className="space-y-8">
            {sections.map((section, idx) => (
              <div key={idx} className="border-b border-slate-100 pb-8 last:border-0">
                <h2 className="text-lg font-bold text-slate-900 mb-3">{section.title}</h2>
                <p className="text-slate-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}