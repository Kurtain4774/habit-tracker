import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { HabitCalendar } from "@/types/habit";
import { yyyyMmDd } from "@/utils/date";

export function useHabits() {
  const [habits, setHabits] = useState<HabitCalendar[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadHabits() {
    setLoading(true);

    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7 * 12 + 1);

    const data = await api<HabitCalendar[]>(
      `/habits/calendar?from=${yyyyMmDd(from)}&to=${yyyyMmDd(to)}`
    );

    setHabits(data);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      await loadHabits();
    })();
  }, []);

  return {
    habits,
    setHabits,
    loading,
    reload: loadHabits,
  };
}