import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/middleware/auth";
import { addDaysUTC, dateKeyUTC } from "@/utils/date";
import { Habit } from "@prisma/client";

export async function GET(req: Request) {
  const auth = await verifyAuth(req);

  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90);

  const habits = await prisma.habit.findMany({
    where: { userId: auth.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      logs: {
        where: { date: { gte: since } },
        select: { date: true, done: true },
        orderBy: { date: "asc" },
      },
    },
  });

  const todayKey = dateKeyUTC(new Date());

const result = habits.map((h: Habit & { logs: { date: Date; done: boolean }[] }) => {    const doneSet = new Set(
      h.logs.filter((l) => l.done).map((l) => dateKeyUTC(l.date))
    );

    let done7 = 0;
    for (let i = 0; i < 7; i++) {
      if (doneSet.has(addDaysUTC(todayKey, -i))) done7++;
    }

    return {
      id: h.id,
      title: h.title,
      frequency: h.frequency,
      targetPerWeek: h.targetPerWeek,
      stats: {
        completion7: Number((done7 / 7).toFixed(2)),
      },
    };
  });

  return NextResponse.json(result);
}