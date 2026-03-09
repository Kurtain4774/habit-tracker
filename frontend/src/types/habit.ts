export type HabitCalendar = {
  id: string;
  title: string;
  frequency: "daily" | "weekly";
  targetPerWeek?: number | null;
  logs: { date: string; done: boolean }[];
};