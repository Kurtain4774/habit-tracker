export function calculateStreak(
  logs: { date: string; done: boolean }[]
) {
  const sorted = [...logs]
    .filter((l) => l.done)
    .sort((a, b) => b.date.localeCompare(a.date));

  let streak = 0;
  let current = new Date();

  for (const log of sorted) {
    const logDate = new Date(log.date);

    const diff =
      (current.getTime() - logDate.getTime()) /
      (1000 * 60 * 60 * 24);

    if (Math.floor(diff) === 0 || Math.floor(diff) === 1) {
      streak++;
      current = logDate;
    } else {
      break;
    }
  }

  return streak;
}