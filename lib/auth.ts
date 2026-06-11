import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type DemoUser = {
  id: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN" | "PARTNER";
};

const COOKIE = "tantor_demo_user";

const fallbackUser: DemoUser = {
  id: "demo-user",
  fullName: "Marie Dupont",
  email: "user@tantordec.fr",
  role: "USER"
};

const fallbackAdmin: DemoUser = {
  id: "demo-admin",
  fullName: "Administrateur Tantor",
  email: "admin@tantordec.fr",
  role: "ADMIN"
};

export async function getCurrentUser(): Promise<DemoUser | null> {
  const raw = cookies().get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (parsed?.role === "ADMIN") return fallbackAdmin;
    if (parsed?.role === "PARTNER") return { ...fallbackUser, role: "PARTNER", fullName: "Cabinet Partenaire", email: "partenaire@tantordec.fr" };
    return fallbackUser;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/app/dashboard");
  return user;
}

export async function createDemoSession(role: DemoUser["role"] = "USER") {
  const payload = Buffer.from(JSON.stringify({ role }), "utf8").toString("base64url");
  cookies().set(COOKIE, payload, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
}

export async function clearSession() {
  cookies().delete(COOKIE);
}

export function getOrganizationId() {
  return "demo-organization";
}

export async function hashPassword(password: string) { return password; }
export async function verifyPassword() { return true; }
export async function createSession() { await createDemoSession("USER"); }
