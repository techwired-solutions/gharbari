import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_MAX_AGE, createAdminSessionToken } from "@/lib/admin-auth";
import { isRateLimited, requestKeyFromHeaders } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const key = requestKeyFromHeaders(req.headers);
  if (isRateLimited(`admin-login:${key}`, { limit: 8, windowMs: 5 * 60_000 })) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password" }, { status: 400 });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminName = process.env.ADMIN_NAME ?? "Admin";
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !passwordHash) {
    return NextResponse.json({ error: "Admin login is not configured" }, { status: 500 });
  }

  const { email, password } = parsed.data;
  const emailMatches = email.toLowerCase() === adminEmail.toLowerCase();
  // Always run bcrypt.compare, even on an email mismatch, so the response
  // time doesn't leak whether the email was correct.
  const passwordMatches = await bcrypt.compare(password, passwordHash);

  if (!emailMatches || !passwordMatches) {
    return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });
  }

  const token = await createAdminSessionToken({ email: adminEmail, name: adminName });

  const res = NextResponse.json({ ok: true, name: adminName });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return res;
}
