"use client";

import { useState, useMemo } from "react";
import HabitHeatmap from "@/components/HabitHeatmap";
import { HabitCalendar } from "@/types/habit";
import { api } from "@/lib/api";
import { yyyyMmDd } from "@/utils/date";
import { Trash2, CheckCircle2, XCircle, Flame, Loader2 } from "lucide-react";
import { calculateStreak } from "@/utils/streak";
import DeleteModal from "@/components/ui/DeleteModal";

export default function HabitCard({
  habit,
  onDelete,
}: {
  habit: HabitCalendar;
  onDelete: (id: string) => void;
}) {
  const [logs, setLogs] = useState(habit.logs);
  const [busy, setBusy] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const todayStr = useMemo(() => yyyyMmDd(new Date()), []);
  const streak = calculateStreak(logs);

  async function toggleDay(date: string) {
    if (busy) return;
    setBusy(true);
    try {
      const existing = logs.find((l) => l.date === date);
      if (!existing) {
        await api(`/habits/${habit.id}/checkin`, { 
          method: "POST", 
          body: JSON.stringify({ date, done: true }) 
        });
        setLogs((prev) => [...prev, { date, done: true }]);
      } else if (existing.done) {
        await api(`/habits/${habit.id}/checkin`, { 
          method: "POST", 
          body: JSON.stringify({ date, done: false }) 
        });
        setLogs((prev) => prev.map((l) => (l.date === date ? { ...l, done: false } : l)));
      } else {
        await api(`/habits/${habit.id}/checkin?date=${date}`, { method: "DELETE" });
        setLogs((prev) => prev.filter((l) => l.date !== date));
      }
    } finally {
      setBusy(false);
    }
  }

  async function setTodayDone(done: boolean) {
    if (busy) return;
    setBusy(true);
    try {
      await api(`/habits/${habit.id}/checkin`, { 
        method: "POST", 
        body: JSON.stringify({ date: todayStr, done }) 
      });
      setLogs((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex((l) => l.date === todayStr);
        if (idx >= 0) copy[idx] = { date: todayStr, done };
        else copy.push({ date: todayStr, done });
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api(`/habits/${habit.id}`, { method: "DELETE" });
      onDelete(habit.id);
    } catch (error) {
      console.error("Failed to delete habit:", error);
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  const weeklyDone = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);
    return logs.filter((l) => l.date >= yyyyMmDd(startOfWeek) && l.done).length;
  }, [logs]);

  const goalMet = habit.targetPerWeek && weeklyDone >= habit.targetPerWeek;

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:scale-[1.01] transition-all">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{habit.title}</h3>
          <div className={`flex items-center gap-2 text-sm mt-1 ${streak >= 7 ? "text-orange-500" : "text-slate-400"}`}>
            <Flame size={16} fill={streak >= 7 ? "currentColor" : "none"} />
            <span className="font-semibold">{streak} day streak</span>
          </div>
        </div>
        <button
          onClick={() => setShowDelete(true)}
          className="cursor-pointer p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Heatmap */}
      <div className="mt-4">
        <HabitHeatmap logs={logs} weeks={12} endDate={todayStr} onClickDay={busy ? undefined : toggleDay} />
      </div>

      {/* Weekly progress */}
      {habit.frequency === "weekly" && habit.targetPerWeek && (
        <div className="mt-6">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-slate-500">Weekly Progress</span>
            <span className="text-slate-900">{weeklyDone}/{habit.targetPerWeek}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${goalMet ? "bg-emerald-500" : "bg-indigo-500"}`}
              style={{ width: `${Math.min((weeklyDone / habit.targetPerWeek) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Today buttons */}
      <div className="flex gap-3 mt-6">
        <button
          disabled={busy}
          onClick={() => setTodayDone(true)}
          className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {busy ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />} 
          Done
        </button>
        <button
          disabled={busy}
          onClick={() => setTodayDone(false)}
          className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <XCircle size={18} /> Missed
        </button>
      </div>

      {/* Shared Professional Modal */}
      <DeleteModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Habit"
        itemName={habit.title}
      />
    </div>
  );
}