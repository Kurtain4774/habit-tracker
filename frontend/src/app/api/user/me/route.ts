import { NextResponse } from "next/server";
import { verifyAuth } from "@/middleware/auth";

export async function GET(req: Request) {
  const auth = await verifyAuth(req);

  if ("error" in auth) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status }
    );
  }

  return NextResponse.json(auth.user);
}