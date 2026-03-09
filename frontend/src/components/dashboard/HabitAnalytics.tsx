"use client";

import { HabitCalendar } from "@/types/habit";

export default function HabitAnalytics({
  habits,
}: {
  habits: HabitCalendar[];
}) {
  const last30 = new Date();
  last30.setDate(last30.getDate() - 30);

  let totalLogs = 0;
  let completedLogs = 0;

  let bestHabit = "";
  let bestRate = 0;

  let worstHabit = "";
  let worstRate = 1;

  habits.forEach((habit) => {
    const logs = habit.logs.filter(
      (l) => new Date(l.date) >= last30
    );

    const done = logs.filter((l) => l.done).length;
    const rate = logs.length === 0 ? 0 : done / logs.length;

    totalLogs += logs.length;
    completedLogs += done;

    if (rate > bestRate) {
      bestRate = rate;
      bestHabit = habit.title;
    }

    if (rate < worstRate) {
      worstRate = rate;
      worstHabit = habit.title;
    }
  });

  const completionRate =
    totalLogs === 0 ? 0 : Math.round((completedLogs / totalLogs) * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
      <h2 className="font-bold text-lg">Analytics</h2>

      <div className="grid grid-cols-2 gap-4 text-sm">

        <Stat label="Best Habit" value={`${bestHabit} (${Math.round(bestRate * 100)}%)`} />

        <Stat label="Needs Work" value={`${worstHabit} (${Math.round(worstRate * 100)}%)`} />

        <Stat label="Total Check-ins" value={`${completedLogs}`} />

        <Stat label="30 Day Rate" value={`${completionRate}%`} />

      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-slate-500 text-xs">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}