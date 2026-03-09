// backend/routes/habits.ts
import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { z } from "zod";
import { toDateOnlyUTC, todayUTCDateOnly, dateKeyUTC, addDaysUTC } from "../utils/date";
import bcrypt from "bcryptjs";

const router = Router();
router.use(requireAuth);

// ----------------- Helpers -----------------
function requireIdParam(req: AuthedRequest, res: any): string | null {
  const id = req.params?.id;
  if (typeof id !== "string") {
    res.status(400).json({ error: "Invalid id" });
    return null;
  }
  return id;
}

function sendError(res: any, message: string, status = 400) {
  return res.status(status).json({ error: message });
}

// ----------------- Delete Habit Check-in -----------------
router.delete("/:id/checkin", async (req: AuthedRequest, res) => {
  const habitId = requireIdParam(req, res);
  if (!habitId) return;

  const dateStr = typeof req.query.date === "string" ? req.query.date : undefined;
  if (!dateStr) return sendError(res, "date is required (YYYY-MM-DD)");

  let date: Date;
  try {
    date = toDateOnlyUTC(dateStr);
  } catch {
    return sendError(res, "Invalid date format (use YYYY-MM-DD)");
  }

  const habit = await prisma.habit.findUnique({ where: { id: habitId } });
  if (!habit || habit.userId !== req.user!.id) return sendError(res, "Not found", 404);

  await prisma.habitLog.deleteMany({ where: { habitId, date } });
  res.json({ ok: true });
});

// ----------------- Habit Calendar -----------------
const DateRangeQuery = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

router.get("/calendar", async (req: AuthedRequest, res) => {
  let query;
  try {
    query = DateRangeQuery.parse(req.query);
  } catch {
    return sendError(res, "from and to are required (YYYY-MM-DD)");
  }

  let from: Date, to: Date;
  try {
    from = toDateOnlyUTC(query.from);
    to = toDateOnlyUTC(query.to);
  } catch {
    return sendError(res, "Invalid date format");
  }

  const habits = await prisma.habit.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
    include: {
      logs: { where: { date: { gte: from, lte: to } }, select: { date: true, done: true }, orderBy: { date: "asc" } },
    },
  });

  const result = habits.map((h) => ({
    id: h.id,
    title: h.title,
    frequency: h.frequency,
    targetPerWeek: h.targetPerWeek,
    logs: h.logs.map((l) => ({
      date: dateKeyUTC(l.date),
      done: l.done,
    })),
  }));

  res.json(result);
});

// ----------------- Habits with Stats -----------------
router.get("/with-stats", async (req: AuthedRequest, res) => {
  const userId = req.user!.id;
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90);

  const habits = await prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { logs: { where: { date: { gte: since } }, select: { date: true, done: true }, orderBy: { date: "asc" } } },
  });

  const todayKey = dateKeyUTC(new Date());

  const result = habits.map((h) => {
    const doneSet = new Set(h.logs.filter((l) => l.done).map((l) => dateKeyUTC(l.date)));

    let weeklyProgress: number | null = null;
    let weeklyGoalMet: boolean | null = null;
    if (h.frequency === "weekly" && h.targetPerWeek) {
      const weekStart = addDaysUTC(todayKey, -((new Date(todayKey).getUTCDay() + 6) % 7));
      let count = 0;
      for (let i = 0; i < 7; i++) if (doneSet.has(addDaysUTC(weekStart, i))) count++;
      weeklyProgress = count;
      weeklyGoalMet = count >= h.targetPerWeek;
    }

    let done7 = 0;
    for (let i = 0; i < 7; i++) if (doneSet.has(addDaysUTC(todayKey, -i))) done7++;
    const completion7 = Number((done7 / 7).toFixed(2));

    const doneDatesTS = Array.from(doneSet).map((d) => new Date(d).getTime()).sort((a, b) => a - b);
    let longestStreak = 0, currentStreak = 0, run = 0, prevTS: number | null = null;

    for (const ts of doneDatesTS) {
      if (prevTS === null || ts - prevTS === 86400000) run++;
      else run = 1;
      if (run > longestStreak) longestStreak = run;
      prevTS = ts;
    }

    for (let i = 0; i < 365; i++) {
      if (doneSet.has(addDaysUTC(todayKey, -i))) currentStreak++;
      else break;
    }

    return {
      id: h.id,
      title: h.title,
      frequency: h.frequency,
      targetPerWeek: h.targetPerWeek,
      stats: {
        currentStreak: h.frequency === "daily" ? currentStreak : null,
        longestStreak: h.frequency === "daily" ? longestStreak : null,
        completion7,
        weeklyProgress,
        weeklyGoalMet,
      },
    };
  });

  res.json(result);
});

// ----------------- Get Current User -----------------
router.get("/me", (req: AuthedRequest, res) => {
  res.json(req.user);
});

// ----------------- Update User (NEW) -----------------
const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

router.patch("/update", async (req: AuthedRequest, res) => {
  const parsed = UpdateUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { name, email, currentPassword, newPassword } = parsed.data;
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ error: "User not found" });

  // Verify current password if newPassword provided
  if (newPassword) {
    if (!currentPassword) return res.status(400).json({ error: "Current password required" });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
  }

  const updated = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name, email, password: user.password },
  });

  res.json({ ok: true, user: updated });
});

// ----------------- Today's Habits -----------------
router.get("/today", async (req: AuthedRequest, res) => {
  const userId = req.user!.id;
  const today = todayUTCDateOnly();

  const habits = await prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { logs: { where: { date: today }, select: { done: true, date: true }, take: 1 } },
  });

  const result = habits.map((h) => {
    const todayLog = h.logs[0] ?? null;
    const { logs, ...rest } = h;
    return { ...rest, todayLog };
  });

  res.json(result);
});

// ----------------- Basic CRUD -----------------
router.get("/", async (req: AuthedRequest, res) => {
  const habits = await prisma.habit.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: "desc" } });
  res.json(habits);
});

const CreateHabitSchema = z.object({
  title: z.string().min(1).max(60),
  frequency: z.enum(["daily", "weekly"]),
  targetPerWeek: z.number().int().min(1).max(7).optional(),
  color: z.string().optional(),
});

router.post("/", async (req: AuthedRequest, res) => {
  const parsed = CreateHabitSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, "Invalid input");

  const data = parsed.data;
  if (data.frequency === "weekly" && !data.targetPerWeek) return sendError(res, "targetPerWeek required for weekly");

  const habit = await prisma.habit.create({ data: { ...data, userId: req.user!.id } });
  res.json(habit);
});

router.get("/:id", async (req: AuthedRequest, res) => {
  const id = requireIdParam(req, res);
  if (!id) return;

  const habit = await prisma.habit.findUnique({
    where: { id },
    include: { logs: { orderBy: { date: "asc" }, select: { date: true, done: true } } },
  });
  if (!habit || habit.userId !== req.user!.id) return sendError(res, "Not found", 404);

  res.json({
    id: habit.id,
    title: habit.title,
    frequency: habit.frequency,
    targetPerWeek: habit.targetPerWeek,
    logs: habit.logs.map((l) => ({ date: dateKeyUTC(l.date), done: l.done })),
  });
});

router.delete("/:id", async (req: AuthedRequest, res) => {
  const id = requireIdParam(req, res);
  if (!id) return;

  const habit = await prisma.habit.findUnique({ where: { id } });
  if (!habit || habit.userId !== req.user!.id) return sendError(res, "Not found", 404);

  await prisma.habit.delete({ where: { id } });
  res.json({ ok: true });
});

// ----------------- Habit Check-in -----------------
const CheckinSchema = z.object({ date: z.string(), done: z.boolean() });

router.post("/:id/checkin", async (req: AuthedRequest, res) => {
  const id = requireIdParam(req, res);
  if (!id) return;

  const parsed = CheckinSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, "Invalid input");

  const habit = await prisma.habit.findUnique({ where: { id } });
  if (!habit || habit.userId !== req.user!.id) return sendError(res, "Not found", 404);

  const date = toDateOnlyUTC(parsed.data.date);

  const log = await prisma.habitLog.upsert({
    where: { habitId_date: { habitId: habit.id, date } },
    update: { done: parsed.data.done },
    create: { habitId: habit.id, date, done: parsed.data.done },
  });

  res.json(log);
});

export default router;