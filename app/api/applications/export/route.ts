import { getCurrentUser } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";

function csv(value: string | number | null) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role === "candidate") return new Response("Unauthorized", { status: 401 });
  const database = await readDatabase();
  const header = ["Application", "Name", "Email", "Phone", "Location", "Current role", "Industry", "Track", "Status", "Score", "Source", "Submitted"];
  const rows = database.applications.map((item) => [item.number, item.fullName, item.email, item.phone, item.location, item.currentRole, item.industry, item.track, item.status, item.score, item.source, item.createdAt]);
  const output = [header, ...rows].map((row) => row.map(csv).join(",")).join("\n");
  return new Response(output, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=lymora-caio-applications.csv" } });
}
