"use client";

import { HabitCalendar } from "@/types/habit";
import { yyyyMmDd } from "@/utils/date";
import { Flame, CheckCircle2, Target } from "lucide-react";

export default function StatsBar({
  habits,
}: {
  habits: HabitCalendar[];
}) {
  const today = yyyyMmDd(new Date());

  const completedToday = habits.filter((h) =>
    h.logs.some((l) => l.date === today && l.done)
  ).length;

  const totalHabits = habits.length;

  const completionRate =
    totalHabits === 0
      ? 0
      : Math.round((completedToday / totalHabits) * 100);

  const longestStreak = habits.reduce((max, habit) => {
    let streak = 0;
    let best = 0;

    const sorted = [...habit.logs].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    for (const log of sorted) {
      if (log.done) {
        streak++;
        best = Math.max(best, streak);
      } else {
        streak = 0;
      }
    }

    return Math.max(max, best);
  }, 0);

  return (
    <div className=" grid grid-cols-3 gap-4 sticky top-0 bg-[#f9fafb] py-2">
      <StatCard
        icon={<Flame size={18} />}
        label="Longest Streak"
        value={`${longestStreak} days`}
      />

      <StatCard
        icon={<CheckCircle2 size={18} />}
        label="Completed Today"
        value={`${completedToday}/${totalHabits}`}
      />

      <StatCard
        icon={<Target size={18} />}
        label="Completion"
        value={`${completionRate}%`}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
      <div className="text-indigo-600">{icon}</div>

      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="font-bold">{value}</div>
      </div>
    </div>
  );
}