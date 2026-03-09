import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export async function verifyAuth(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return { error: "Missing token", status: 401 };
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return { error: "User not found", status: 401 };
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? "Unnamed User",
      } as AuthUser,
    };
  } catch (err) {
    return { error: "Invalid token", status: 401 };
  }
}