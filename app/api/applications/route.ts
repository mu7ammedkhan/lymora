import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { updateDatabase } from "@/lib/os/store";

const applicationSchema = z.object({
  "Full name": z.string().min(2),
  Email: z.string().email(),
  "Mobile or WhatsApp": z.string().min(5),
  "Country and city": z.string().min(2),
  "Current role": z.string().min(2),
  Industry: z.string().min(2),
  "Professional experience": z.string().min(2),
  "Current use of AI": z.string().min(2),
  "Preferred operator track": z.string().min(2),
  "Workflow to improve": z.string().min(5),
  "Why CAIO now": z.string().min(5),
  "Schedule commitment": z.string().min(2),
  "Investment readiness": z.string().min(2),
  "LinkedIn profile": z.string().optional().default(""),
  Consent: z.literal("Granted"),
});

export async function POST(request: Request) {
  const parsed = applicationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid application" }, { status: 400 });
  const input = parsed.data;
  let duplicate = false;
  let number = "";

  await updateDatabase((database) => {
    duplicate = database.applications.some((item) => item.email.toLowerCase() === input.Email.toLowerCase());
    if (duplicate) return;
    const sequence = Math.max(26080, ...database.applications.map((item) => Number(item.number.replace(/\D/g, "")) || 0)) + 1;
    number = `CAIO-${sequence}`;
    const now = new Date().toISOString();
    const id = randomUUID();
    database.applications.unshift({
      id, number, fullName: input["Full name"], email: input.Email.toLowerCase(), phone: input["Mobile or WhatsApp"], location: input["Country and city"],
      currentRole: input["Current role"], industry: input.Industry, experience: input["Professional experience"], aiLevel: input["Current use of AI"],
      track: input["Preferred operator track"], workflowGoal: input["Workflow to improve"], motivation: input["Why CAIO now"],
      scheduleCommitment: input["Schedule commitment"], investmentReadiness: input["Investment readiness"], linkedinUrl: input["LinkedIn profile"],
      status: "new", score: null, notes: "", source: "website", reviewedBy: null, createdAt: now, updatedAt: now,
    });
    database.activities.unshift({ id: randomUUID(), actorId: null, action: "application.received", entityType: "application", entityId: id, detail: `Received website application from ${input["Full name"]}`, createdAt: now });
  });

  return NextResponse.json({ ok: true, duplicate, number }, { status: 201 });
}
