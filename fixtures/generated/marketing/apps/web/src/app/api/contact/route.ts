import { z } from "zod";
import { email } from "../../../lib/email";
const form = z.object({ name: z.string().min(1).max(100), email: z.email(), message: z.string().min(1).max(5000) });
export async function POST(request: Request) {
  const trustedOrigin = new URL(process.env.APP_URL ?? request.url).origin;
  if (request.headers.get("origin") !== trustedOrigin) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const parsed = form.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Please check the form fields." }, { status: 400 });
  const to = process.env.CONTACT_EMAIL;
  if (!to) return Response.json({ error: "Contact is unavailable right now." }, { status: 503 });
  const { name, email: from, message } = parsed.data;
  try {
    await email.send({ to, subject: `Contact from ${name.replace(/[\r\n]/g, " ")}`, text: `From: ${from}\n\n${message}`, key: crypto.randomUUID() });
    return Response.json({ ok: true });
  } catch { return Response.json({ error: "Message could not be sent. Please retry." }, { status: 503 }); }
}
