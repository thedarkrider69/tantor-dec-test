"use server";

import { redirect } from "next/navigation";
import { clearSession, createDemoSession } from "@/lib/auth";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAction(formData: FormData) {
  const email = value(formData, "email").toLowerCase();
  if (email.includes("admin")) {
    await createDemoSession("ADMIN");
    redirect("/admin/dashboard");
  }
  if (email.includes("partenaire")) {
    await createDemoSession("PARTNER");
    redirect("/app/dashboard");
  }
  await createDemoSession("USER");
  redirect("/app/dashboard");
}

export async function registerAction() {
  await createDemoSession("USER");
  redirect("/app/dashboard?success=Compte%20créé%20avec%20succès");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}

export async function demoSuccessAction(formData: FormData) {
  const next = value(formData, "next") || "/app/dashboard?success=Action%20enregistrée";
  redirect(next);
}
