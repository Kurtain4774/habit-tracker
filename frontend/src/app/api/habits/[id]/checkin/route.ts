import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/middleware/auth";
import { toDateOnlyUTC } from "@/utils/date";
import { z } from "zod";

const CheckinSchema = z.object({
  date: z.string(),
  done: z.boolean(),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAuth(req);

  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const parsed = CheckinSchema.safeParse(body);

  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const habit = await prisma.habit.findUnique({
    where: { id: params.id },
  });

  if (!habit || habit.userId !== auth.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const date = toDateOnlyUTC(parsed.data.date);

  const log = await prisma.habitLog.upsert({
    where: {
      habitId_date: {
        habitId: habit.id,
        date,
      },
    },
    update: { done: parsed.data.done },
    create: {
      habitId: habit.id,
      date,
      done: parsed.data.done,
    },
  });

  return NextResponse.json(log);
}