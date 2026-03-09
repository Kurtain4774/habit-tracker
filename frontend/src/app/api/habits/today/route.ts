import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/middleware/auth";
import { todayUTCDateOnly } from "@/utils/date";

export async function GET(req: Request) {
  const auth = await verifyAuth(req);

  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const today = todayUTCDateOnly();

  const habits = await prisma.habit.findMany({
    where: { userId: auth.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      logs: {
        where: { date: today },
        select: { done: true, date: true },
        take: 1,
      },
    },
  });

  const result = habits.map((h) => {
    const todayLog = h.logs[0] ?? null;
    const { logs, ...rest } = h;

    return {
      ...rest,
      todayLog,
    };
  });

  return NextResponse.json(result);
}