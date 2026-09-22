import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
export type Message = {
  to: string;
  subject: string;
  text: string;
  key: string;
};
export interface EmailProvider {
  send(message: Message): Promise<void>;
}

const local: EmailProvider = {
  async send(message) {
    const mailbox =
      process.env.LOCAL_MAILBOX_DIR ??
      (process.env.NODE_ENV === "production"
        ? join(tmpdir(), "stackiln-mailbox")
        : join(process.cwd(), ".local-mailbox"));
    await mkdir(mailbox, { recursive: true });
    await writeFile(
      join(mailbox, `${message.key}.json`),
      `${JSON.stringify(message, null, 2)}\n`,
      { flag: "wx" },
    );
  },
};
const resend: EmailProvider = {
  async send(message) {
    const key = process.env.RESEND_API_KEY;
    if (!key)
      throw new Error("RESEND_API_KEY is required for production email");
    const { Resend } = await import("resend");
    const response = await new Resend(key).emails.send(
      {
        from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
        to: message.to,
        subject: message.subject,
        text: message.text,
      },
      { idempotencyKey: message.key },
    );
    if (response.error) throw new Error("Email delivery failed");
  },
};
export const email: EmailProvider =
  process.env.APP_ENV === "production" ? resend : local;
