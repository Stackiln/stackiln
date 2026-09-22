import { z } from "zod";
import { email } from "../../../lib/email";
const form = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  message: z.string().min(1).max(5000),
});
export async function POST(request: Request) {
  const documentRequest =
    request.headers.get("accept")?.includes("text/html") ?? false;
  const error = (message: string, status: number) =>
    documentRequest
      ? Response.redirect(new URL("/contact/error", request.url), 303)
      : Response.json({ error: message }, { status });
  const trustedOrigin = new URL(process.env.APP_URL ?? request.url).origin;
  if (request.headers.get("origin") !== trustedOrigin)
    return error("Invalid request origin.", 403);
  const input = documentRequest
    ? Object.fromEntries(await request.formData())
    : await request.json().catch(() => null);
  const parsed = form.safeParse(input);
  if (!parsed.success) return error("Please check the form fields.", 400);
  const to = process.env.CONTACT_EMAIL;
  if (!to) return error("Contact is unavailable right now.", 503);
  const { name, email: from, message } = parsed.data;
  try {
    await email.send({
      to,
      subject: `Contact from ${name.replace(/[\r\n]/g, " ")}`,
      text: `From: ${from}\n\n${message}`,
      key: crypto.randomUUID(),
    });
    return documentRequest
      ? Response.redirect(new URL("/contact/thanks", request.url), 303)
      : Response.json({ ok: true });
  } catch {
    return error("Message could not be sent. Please retry.", 503);
  }
}
