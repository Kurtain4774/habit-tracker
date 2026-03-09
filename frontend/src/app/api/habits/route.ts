import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/middleware/auth";
import { z } from "zod";

const CreateHabitSchema = z.object({
  title: z.string().min(1).max(60),
  frequency: z.enum(["daily", "weekly"]),
  targetPerWeek: z.number().int().min(1).max(7).optional(),
  color: z.string().optional(),
});

export async function GET(req: Request) {
  const auth = await verifyAuth(req);

  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const habits = await prisma.habit.findMany({
    where: { userId: auth.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(habits);
}

export async function POST(req: Request) {
  const auth = await verifyAuth(req);

  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const parsed = CreateHabitSchema.safeParse(body);

  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const data = parsed.data;

  if (data.frequency === "weekly" && !data.targetPerWeek)
    return NextResponse.json(
      { error: "targetPerWeek required for weekly habits" },
      { status: 400 }
    );

  const habit = await prisma.habit.create({
    data: {
      ...data,
      userId: auth.user.id,
    },
  });

  return NextResponse.json(habit);
}