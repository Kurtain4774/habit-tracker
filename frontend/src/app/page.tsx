"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  BarChart3,
  Calendar,
  Shield,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100">
      {/* 1. Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-indigo-600">
            <CheckCircle2 size={28} strokeWidth={2.5} />
            <span>HabitFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-semibold text-slate-600">
            <Link href="#features" className="hover:text-indigo-600 transition-colors">
              Features
            </Link>
            <Link href="#methodology" className="hover:text-indigo-600 transition-colors">
              Methodology
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:block font-bold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold transition-all hover:shadow-lg hover:shadow-indigo-200 active:scale-95"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Star size={16} fill="currentColor" />
            <span>Join 10,000+ high-performers</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Build habits that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              actually stick.
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Stop relying on willpower. HabitFlow uses behavioral science to help you
            track, visualize, and master your daily routines.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all group"
            >
              Start Your Journey
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <button className="w-full sm:w-auto border-2 border-slate-200 hover:border-slate-300 px-10 py-5 rounded-2xl font-bold text-lg text-slate-700 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* 3. Social Proof / Product Preview */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
            {/* Replace with an actual screenshot or interactive mock */}
            <Image
              src="/hero-dashboard3.png" // The path starts from the 'public' folder
              alt="HabitFlow Dashboard"
              width={1200}
              height={750}
              priority // This tells Next.js to load this image first (good for Hero sections)
              className="rounded-2xl border border-slate-100 shadow-inner w-full h-auto"
            />
        </div>
      </section>

      {/* 4. Features Grid */}
      <section id="features" className="py-24 bg-slate-50 border-y border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              Everything you need to grow.
            </h2>
            <p className="text-slate-600 font-medium">
              Simple yet powerful tools for personal evolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="text-amber-500" />}
              title="Instant Tracking"
              description="Check off habits in one tap. No friction, just flow."
            />
            <FeatureCard
              icon={<BarChart3 className="text-indigo-600" />}
              title="Deep Analytics"
              description="Understand your patterns with heatmaps and completion trends."
            />
            <FeatureCard
              icon={<Calendar className="text-emerald-500" />}
              title="Smart Scheduling"
              description="Flexible routines that adapt to your specific lifestyle."
            />
          </div>
        </div>
      </section>

      {/* 5. Footer CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl shadow-indigo-200">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8">
            Ready to take control?
          </h2>
          <p className="text-indigo-100 text-lg mb-10 font-medium">
            Join thousands of others building their best selves today. <br />
            No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-indigo-600 px-10 py-5 rounded-2xl font-extrabold text-lg hover:bg-indigo-50 transition-colors shadow-xl"
          >
            Start HabitFlowing Now
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 text-center text-slate-500 font-medium text-sm">
        <p>© 2026 HabitFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 font-medium leading-relaxed">{description}</p>
    </div>
  );
}
