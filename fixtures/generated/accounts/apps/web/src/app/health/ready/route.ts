import { sql } from "drizzle-orm";
import { database } from "@product/db";
export async function GET() {
  try {
    await database().execute(sql`select 1`);
    return Response.json({ status: "ready" });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503 });
  }
}
