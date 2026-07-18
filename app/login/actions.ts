"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticate, destroySession } from "@/lib/os/auth";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) redirect("/login?error=invalid");
  const user = await authenticate(parsed.data.email, parsed.data.password);
  if (!user) redirect("/login?error=credentials");
  redirect("/app");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
