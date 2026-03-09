import { HabitCalendar } from "@/types/habit";
import HabitCard from "./HabitCard";

export default function HabitList({
  habits,
  onDelete,
}: {
  habits: HabitCalendar[];
  onDelete: (id: string) => void;
}) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <p className="text-slate-500 font-medium">No habits yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {habits.map((h) => (
        <HabitCard key={h.id} habit={h} onDelete={onDelete} />
      ))}
    </div>
  );
}