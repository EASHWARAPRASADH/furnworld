import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "fw_admin";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "furnworld-dev-secret-change-me-in-production-please"
);

export async function createSession(username: string): Promise<void> {
  const token = await new SignJWT({ sub: username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSession(): Promise<{ username: string } | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin" || typeof payload.sub !== "string") return null;
    return { username: payload.sub };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<{ username: string }> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export const SESSION_COOKIE = COOKIE;
