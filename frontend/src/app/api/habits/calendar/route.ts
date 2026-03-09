import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/middleware/auth";
import { z } from "zod";
import { toDateOnlyUTC, dateKeyUTC } from "@/utils/date";

const DateRangeQuery = z.object({
  from: z.string(),
  to: z.string(),
});

export async function GET(req: Request) {
  const auth = await verifyAuth(req);

  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(req.url);

  const parsed = DateRangeQuery.safeParse({
    from: searchParams.get("from"),
    to: searchParams.get("to"),
  });

  if (!parsed.success)
    return NextResponse.json(
      { error: "from and to required YYYY-MM-DD" },
      { status: 400 }
    );

  const from = toDateOnlyUTC(parsed.data.from);
  const to = toDateOnlyUTC(parsed.data.to);

  const habits = await prisma.habit.findMany({
    where: { userId: auth.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      logs: {
        where: { date: { gte: from, lte: to } },
        select: { date: true, done: true },
        orderBy: { date: "asc" },
      },
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

  return NextResponse.json(result);
}