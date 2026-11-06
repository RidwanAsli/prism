import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";

const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((value) => value.toLowerCase()),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = waitlistSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error:
            parsed.error.issues[0]?.message ?? "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const existing = await db.waitlistEntry.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({
        ok: true,
        alreadyExists: true,
        message: "You are already on the list — magic takes patience.",
      });
    }

    await db.waitlistEntry.create({
      data: { email },
    });

    return NextResponse.json({
      ok: true,
      alreadyExists: false,
      message: "Welcome aboard. The magic is coming your way.",
    });
  } catch (error) {
    console.error("[waitlist] failed to join:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
