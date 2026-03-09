"use client";

import { useMemo } from "react";
import { HabitCalendar } from "@/types/habit";
import { yyyyMmDd, formatPrettyDate } from "@/utils/date";

const GRID_ROWS = 7;
const TOTAL_DAYS = 364; // 52 weeks * 7 days
const weekdays = ["Mon", "Wed", "Fri"];

export default function ActivityCalendar({ habits }: { habits: HabitCalendar[] }) {
  const memoizedToday = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const { days, months } = useMemo(() => {
    const logMap = new Map<string, number>();

    for (const habit of habits) {
      for (const log of habit.logs) {
        if (log.done) {
          logMap.set(log.date, (logMap.get(log.date) ?? 0) + 1);
        }
      }
    }

    const dayEntries: { date: string; count: number }[] = [];
    const monthEntries: { month: string; col: number }[] = [];
    let lastMonth = -1;

    for (let i = TOTAL_DAYS; i >= 0; i--) {
      const d = new Date(memoizedToday);
      d.setDate(memoizedToday.getDate() - i);

      const dateStr = yyyyMmDd(d);
      dayEntries.push({ date: dateStr, count: logMap.get(dateStr) ?? 0 });

      const currentMonth = d.getMonth();
      if (currentMonth !== lastMonth) {
        monthEntries.push({
          month: d.toLocaleString("default", { month: "short" }),
          col: Math.floor((TOTAL_DAYS - i) / GRID_ROWS),
        });
        lastMonth = currentMonth;
      }
    }

    return { days: dayEntries, months: monthEntries };
  }, [habits, memoizedToday]);

  // Height of each row (square + gap)
  const rowHeight = 12 + 2; // h-3 = 12px, gap-[2px] = 2px
  const gridHeight = GRID_ROWS * rowHeight; // 7 * 14 = 98px

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm w-full">
      <h2 className="font-bold text-lg mb-6 text-slate-800">Annual Activity</h2>

      <div className="overflow-x-auto">
        {/* Month Labels */}
        <div className="relative h-6 mb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-tight">
          {months.map((m, idx) => (
            <span
              key={`${m.month}-${idx}`}
              className="absolute"
              style={{ left: `${m.col * 14 + 28}px` }} // 16px offset for weekday labels
            >
              {m.month}
            </span>
          ))}
        </div>

        <div className="flex">
          {/* Weekday labels aligned to heatmap grid */}
          <div
            className="flex flex-col justify-between mr-1 text-[11px] text-slate-400 font-medium"
            style={{ height: `${gridHeight}px` }}
          >
            {weekdays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="inline-block min-w-max">
            <div className="grid grid-rows-7 grid-flow-col gap-[2px]">
              {days.map((day) => (
                <div
                  key={day.date}
                  title={`${formatPrettyDate(day.date)}: ${day.count} habit${day.count !== 1 ? "s" : ""}`}
                  className={`w-3 h-3 rounded-[2px] transition-colors hover:ring-2 hover:ring-indigo-400 hover:ring-offset-1 ${getColor(day.count)}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getColor(count: number) {
  if (count === 0) return "bg-slate-100";
  if (count === 1) return "bg-emerald-100";
  if (count === 2) return "bg-emerald-300";
  if (count === 3) return "bg-emerald-500";
  return "bg-emerald-700";
}
