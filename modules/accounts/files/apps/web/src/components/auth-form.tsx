"use client";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Mode = "sign-in" | "sign-up" | "forgot-password" | "reset-password";
const subscribe = () => () => {};
const titles: Record<Mode, string> = {
  "sign-in": "Sign in", "sign-up": "Create account", "forgot-password": "Reset password", "reset-password": "Choose a new password"
};

export function AuthForm({ mode, token }: { mode: Mode; token?: string }) {
  const router = useRouter();
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const values = new FormData(event.currentTarget);
    const email = String(values.get("email") ?? "").trim();
    const password = String(values.get("password") ?? "");
    try {
      if (mode === "sign-in") {
        const result = await authClient.signIn.email({ email, password });
        if (result.error) throw new Error();
        router.push("/account");
        router.refresh();
      } else if (mode === "sign-up") {
        const result = await authClient.signUp.email({ name: String(values.get("name") ?? "").trim(), email, password });
        if (result.error) throw new Error();
        setNotice("Check your email for a verification link before signing in.");
      } else if (mode === "forgot-password") {
        await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
        setNotice("If that address has an account, a reset link is on its way.");
      } else {
        if (!token) throw new Error();
        const result = await authClient.resetPassword({ newPassword: password, token });
        if (result.error) throw new Error();
        setNotice("Password changed. You can now sign in.");
      }
    } catch {
      setNotice(mode === "sign-in" ? "We could not sign you in. Check your details and verify your email." : "That request could not be completed. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return <div className="content-page auth-page"><h1>{titles[mode]}</h1><form onSubmit={submit}>
    {mode === "sign-up" && <label className="field">Name<input name="name" autoComplete="name" required maxLength={120} /></label>}
    {mode !== "reset-password" && <label className="field">Email<input name="email" type="email" autoComplete="email" required /></label>}
    {(mode === "sign-in" || mode === "sign-up" || mode === "reset-password") && <label className="field">Password<input name="password" type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength={8} required /></label>}
    <button className="button button-default" disabled={!ready || busy || (mode === "reset-password" && !token)}>{busy ? "Working..." : titles[mode]}</button>
  </form><p role="status" aria-live="polite">{notice}</p><div className="auth-links">
    {mode !== "sign-in" && <Link href="/sign-in">Sign in</Link>}
    {mode === "sign-in" && <><Link href="/sign-up">Create account</Link><Link href="/forgot-password">Forgot password?</Link></>}
  </div></div>;
}
