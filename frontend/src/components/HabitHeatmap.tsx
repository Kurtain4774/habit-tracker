"use client";

type Log = { date: string; done: boolean };

type Props = {
  logs: Log[];
  weeks?: number; // default 12
  endDate: string; // YYYY-MM-DD
  onClickDay?: (date: string) => void;
};

function addDaysUTC(d: Date, days: number) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

function toKeyUTC(d: Date) {
  return d.toISOString().slice(0, 10);
}

function monthShortUTC(d: Date) {
  return d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
}

export default function HabitHeatmap({ logs, weeks = 12, endDate, onClickDay }: Props) {
  const doneMap = new Map<string, boolean>();
  for (const l of logs) doneMap.set(l.date, l.done);

  const end = new Date(`${endDate}T00:00:00.000Z`);
  const endKey = endDate;

  const start = addDaysUTC(end, -(weeks * 7 - 1));

  // Precompute month labels per week column
  const monthLabels: (string | null)[] = [];
  for (let w = 0; w < weeks; w++) {
    const weekStart = addDaysUTC(start, w * 7);
    const label = monthShortUTC(weekStart);
    if (w === 0) monthLabels.push(label);
    else {
      const prev = monthLabels[w - 1] ?? monthShortUTC(addDaysUTC(start, (w - 1) * 7));
      monthLabels.push(label !== prev ? label : null);
    }
  }

  const columns: { key: string; done: boolean | null; isToday: boolean; isFuture: boolean }[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col = [];
    for (let r = 0; r < 7; r++) {
      const idx = w * 7 + r;
      const day = addDaysUTC(start, idx);
      const key = toKeyUTC(day);

      const isFuture = key > endKey;
      const done = isFuture ? null : doneMap.has(key) ? (doneMap.get(key) as boolean) : null;

      col.push({ key, done, isToday: key === endKey, isFuture });
    }
    columns.push(col);
  }

  function cellClass(done: boolean | null, isFuture: boolean) {
    if (isFuture) return "bg-gray-50";
    if (done === null) return "bg-gray-100";
    return done ? "bg-gray-900" : "bg-gray-300";
  }

  const dayLabels = ["", "M", "", "W", "", "F", ""]; // Mon/Wed/Fri markers

  return (
    <div className="flex flex-col gap-2">
      {/* Month labels */}
      <div className="flex gap-1 items-end">
        <div className="w-5" />
        {monthLabels.map((m, i) => (
          <div key={i} className="w-3 text-[10px] text-gray-500 leading-none text-left">
            {m ?? ""}
          </div>
        ))}
      </div>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="w-5 flex flex-col gap-1">
          {dayLabels.map((l, i) => (
            <div key={i} className="h-3 text-[10px] text-gray-500 leading-none">
              {l}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-1">
            {col.map((c) => (
              <button
                key={c.key}
                type="button"
                title={`${c.key}: ${c.isFuture ? "future" : c.done === null ? "no log" : c.done ? "done" : "not done"}`}
                disabled={c.isFuture || !onClickDay}
                aria-label={`${c.key}: ${c.isFuture ? "future" : c.done === null ? "no log" : c.done ? "done" : "not done"}`}
                aria-current={c.isToday ? "date" : undefined}
                onClick={() => onClickDay?.(c.key)}
                className={`w-3 h-3 rounded-sm ${cellClass(c.done, c.isFuture)} ${
                  c.isToday ? "ring-2 ring-blue-500" : ""
                } ${c.isFuture ? "" : "hover:ring-1 hover:ring-gray-400"} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 transition-all`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>Less</span>
        <span className="w-3 h-3 rounded-sm bg-gray-100 inline-block" />
        <span className="w-3 h-3 rounded-sm bg-gray-300 inline-block" />
        <span className="w-3 h-3 rounded-sm bg-gray-900 inline-block" />
        <span>More</span>
      </div>
    </div>
  );
}