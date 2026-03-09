import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

export type AuthedRequest = Request & {
  user?: { id: string; email: string; name: string };
};

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    const userId = payload.sub;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }, // name may be null in DB
    });

    if (!user) return res.status(401).json({ error: "User not found" });

    // ✅ Provide a fallback for nullable name BEFORE assigning to req.user
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name ?? "Unnamed User", // fallback ensures type is string
    };

    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}