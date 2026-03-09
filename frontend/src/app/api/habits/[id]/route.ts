import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/middleware/auth";
import { dateKeyUTC } from "@/utils/date";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(req);

  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const habit = await prisma.habit.findUnique({
    where: { id: params.id },
    include: {
      logs: {
        orderBy: { date: "asc" },
        select: { date: true, done: true },
      },
    },
  });

  if (!habit || habit.userId !== auth.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: habit.id,
    title: habit.title,
    frequency: habit.frequency,
    targetPerWeek: habit.targetPerWeek,
    logs: habit.logs.map((l: { date: Date; done: boolean }) => ({
      date: dateKeyUTC(l.date),
      done: l.done,
    })),
  });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = await verifyAuth(req);

  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const habit = await prisma.habit.findUnique({
    where: { id: params.id },
  });

  if (!habit || habit.userId !== auth.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.habit.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ ok: true });
}
