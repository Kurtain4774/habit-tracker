"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface CreateHabitFormProps {
  onCreated: () => void;
}

export default function CreateHabitForm({ onCreated }: CreateHabitFormProps) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [targetPerWeek, setTargetPerWeek] = useState(3);
  const [creating, setCreating] = useState(false);

  async function createHabit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setCreating(true);

    try {
      await api("/habits", {
        method: "POST",
        body: JSON.stringify({
          title: trimmedTitle,
          frequency,
          ...(frequency === "weekly" ? { targetPerWeek } : {}),
        }),
      });
      toast.success("Habit created!");
      setTitle("");
      setTargetPerWeek(3);
      onCreated();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create habit");
    } finally {
      setCreating(false);
    }
  }

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <form onSubmit={createHabit} className="flex flex-col md:flex-row gap-4">
        {/* Habit Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Morning Meditation..."
          className="flex-1 bg-slate-50 ring-1 ring-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          required
        />

        {/* Frequency Selector */}
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
          className="bg-slate-50 ring-1 ring-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>

        {/* Weekly Target Input */}
        {frequency === "weekly" && (
          <input
            type="number"
            min={1}
            max={7}
            value={targetPerWeek}
            onChange={(e) => setTargetPerWeek(Number(e.target.value))}
            className="w-24 bg-slate-50 ring-1 ring-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            aria-label="Target per week"
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={creating}
          className={`flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl transition-transform hover:scale-105 active:scale-95 ${
            creating ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
          aria-label="Add habit"
        >
          <Plus size={18} />
          {creating ? "Adding..." : "Add"}
        </button>
      </form>
    </section>
  );
}