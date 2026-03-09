"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Calendar, LayoutDashboard, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { useHabits } from "@/hooks/useHabits";

// Components
import CreateHabitForm from "@/components/dashboard/CreateHabitForm";
import HabitList from "@/components/dashboard/HabitList";
import StatsBar from "@/components/dashboard/StatsBar";
import HabitAnalytics from "@/components/dashboard/HabitAnalytics";
import ActivityCalendar from "@/components/dashboard/ActivityCalendar";
import DashboardMenu from "@/components/dashboard/DashboardMenu";

// Scoped Types
interface User {
  id: string;
  email: string;
  name: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { habits, setHabits, loading: habitsLoading, reload } = useHabits();
  
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // 1. Memoized Date to prevent re-renders on every tick
  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }, []);

  // 2. Robust User Fetching
  useEffect(() => {
    let isMounted = true;
    
    const fetchUser = async () => {
      try {
        const data = await api<User>("/habits/me");
        if (isMounted) setUser(data);
      } catch (error) {
        toast.error("Session expired. Please log in again.");
        // router.push("/login"); // Optional: auto-redirect on auth failure
      } finally {
        if (isMounted) setUserLoading(false);
      }
    };

    fetchUser();
    return () => { isMounted = false; };
  }, []);

  // 3. Optimized Callback for Deletion
  const deleteHabit = useCallback(async (id: string) => {
    const previousHabits = [...habits];
    
    // Optimistic Update
    setHabits((prev) => prev.filter((h) => h.id !== id));

    try {
      await api(`/habits/${id}`, { method: "DELETE" });
      toast.success("Habit deleted");
    } catch (err) {
      setHabits(previousHabits);
      toast.error("Failed to delete habit. Please try again.");
    }
  }, [habits, setHabits]);

  // 4. Unified Loading State
  if (habitsLoading || userLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50" role="status" aria-label="Loading your dashboard">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Setting up your flow...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 selection:bg-indigo-100">
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-indigo-600 select-none">
            <LayoutDashboard size={22} strokeWidth={2.5} aria-hidden="true" />
            <span>HabitFlow</span>
          </div>
          <DashboardMenu user={user} />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {user ? `Welcome back, ${user.name}` : "Your Dashboard"}
            </h1>
            <div className="text-slate-500 flex items-center gap-2 mt-2 font-medium">
              <Calendar size={18} className="text-indigo-500" aria-hidden="true" />
              <time dateTime={new Date().toISOString()}>{formattedDate}</time>
            </div>
          </div>
          <div className="shrink-0">
            <CreateHabitForm onCreated={reload} />
          </div>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Primary Actions */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                <h2 className="font-bold text-slate-800 text-lg">Yearly Consistency</h2>
              </div>
              <div className="overflow-x-auto pb-2 custom-scrollbar">
                <ActivityCalendar habits={habits} />
              </div>
            </section>

            <StatsBar habits={habits} />

            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" aria-hidden="true" />
                  Today&apos;s Habits
                </h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                  {habits.length} Active
                </span>
              </div>
              <div className="p-2 md:p-6">
                <HabitList habits={habits} onDelete={deleteHabit} />
              </div>
            </section>
          </div>

          {/* Right Column: Analytics & Motivation */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sticky top-24">
              <h2 className="font-bold text-slate-400 mb-6 text-xs uppercase tracking-[0.2em]">
                Deep Analytics
              </h2>
              <HabitAnalytics habits={habits} />
              
              <hr className="my-8 border-slate-100" />
              
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200/50">
                <p className="text-[10px] font-bold opacity-70 mb-2 uppercase tracking-widest">
                  Daily Motivation
                </p>
                <p className="text-lg font-semibold leading-snug">
                  &quot;We are what we repeatedly do. Excellence, then, is not an act, but a habit.&quot;
                </p>
                <p className="mt-4 text-xs opacity-60">— Aristotle</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}