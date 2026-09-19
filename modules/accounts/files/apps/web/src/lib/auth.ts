import "server-only";
import { createHash } from "node:crypto";
import { database } from "@product/db";
import * as schema from "@product/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { email } from "./email";

if (process.env.APP_ENV === "production" && (!process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET.length < 32)) {
  throw new Error("Production accounts require BETTER_AUTH_SECRET with at least 32 characters");
}

function mailKey(purpose: string, url: string) {
  return `${purpose}-${createHash("sha256").update(url).digest("hex")}`;
}

export const auth = betterAuth({
  database: drizzleAdapter(database(), { provider: "pg", schema }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.APP_URL ?? "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await email.send({ to: user.email, subject: "Reset your password", text: `Reset your password: ${url}`, key: mailKey("password-reset", url) });
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      await email.send({ to: user.email, subject: "Verify your email", text: `Verify your email: ${url}`, key: mailKey("verify-email", url) });
    }
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await email.send({ to: user.email, subject: "Approve email change", text: `Approve changing your email to ${newEmail}: ${url}`, key: mailKey("change-email", url) });
      }
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await email.send({ to: user.email, subject: "Confirm account deletion", text: `Confirm account deletion: ${url}`, key: mailKey("delete-account", url) });
      }
    }
  },
  rateLimit: { enabled: process.env.APP_ENV === "production", window: 60, max: 100 }
});
