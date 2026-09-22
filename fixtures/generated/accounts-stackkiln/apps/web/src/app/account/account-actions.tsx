"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type SessionItem = {
  token: string;
  userAgent?: string | null;
  createdAt: Date;
};

export function AccountActions({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  async function reloadSessions() {
    const result = await authClient.listSessions();
    if (result.data) setSessions(result.data);
  }
  useEffect(() => {
    let active = true;
    void authClient.listSessions().then((result) => {
      if (active && result.data) setSessions(result.data);
    });
    return () => {
      active = false;
    };
  }, []);
  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const nextName = String(
      new FormData(event.currentTarget).get("name") ?? "",
    ).trim();
    const result = await authClient.updateUser({ name: nextName });
    setNotice(result.error ? "Profile could not be saved." : "Profile saved.");
    setBusy(false);
    router.refresh();
  }
  async function changeEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const newEmail = String(
      new FormData(event.currentTarget).get("email") ?? "",
    ).trim();
    const result = await authClient.changeEmail({
      newEmail,
      callbackURL: "/account",
    });
    setNotice(
      result.error
        ? "Email change could not be started."
        : "Check your current email to approve the change.",
    );
    setBusy(false);
  }
  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const result = await authClient.changePassword({
      currentPassword: String(data.get("current") ?? ""),
      newPassword: String(data.get("next") ?? ""),
      revokeOtherSessions: true,
    });
    setNotice(
      result.error
        ? "Password could not be changed."
        : "Password changed. Other sessions were signed out.",
    );
    if (!result.error) form.reset();
    setBusy(false);
    void reloadSessions();
  }
  async function revoke(token: string) {
    setBusy(true);
    setNotice("");
    const result = await authClient.revokeSession({ token });
    setNotice(
      result.error ? "Session could not be revoked." : "Session revoked.",
    );
    setBusy(false);
    void reloadSessions();
    router.refresh();
  }
  async function requestDeletion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (new FormData(form).get("confirmation") !== "DELETE") {
      setNotice("Type DELETE to confirm.");
      return;
    }
    setBusy(true);
    setNotice("");
    const result = await authClient.deleteUser({ callbackURL: "/" });
    setNotice(
      result.error
        ? "Deletion could not be requested."
        : "Check your email to confirm account deletion.",
    );
    form.reset();
    setBusy(false);
  }
  async function signOut() {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }
  return (
    <div className="account-sections">
      <p role="status" aria-live="polite">
        {notice}
      </p>
      <section>
        <h2>Profile</h2>
        <form onSubmit={updateProfile}>
          <label className="field">
            Name
            <input name="name" defaultValue={name} maxLength={120} required />
          </label>
          <button className="button button-default" disabled={busy}>
            Save profile
          </button>
        </form>
      </section>
      <section>
        <h2>Email</h2>
        <p>Current address: {email}</p>
        <form onSubmit={changeEmail}>
          <label className="field">
            New email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <button className="button button-outline" disabled={busy}>
            Change email
          </button>
        </form>
      </section>
      <section>
        <h2>Password</h2>
        <form onSubmit={changePassword}>
          <label className="field">
            Current password
            <input
              name="current"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <label className="field">
            New password
            <input
              name="next"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <button className="button button-outline" disabled={busy}>
            Change password
          </button>
        </form>
      </section>
      <section>
        <h2>Sessions</h2>
        <ul className="session-list">
          {sessions.map((item) => (
            <li key={item.token}>
              <span>
                {item.userAgent || "Unknown device"}
                <small>{new Date(item.createdAt).toLocaleString()}</small>
              </span>
              <button
                className="button button-outline"
                onClick={() => void revoke(item.token)}
                disabled={busy}
              >
                Revoke
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Your data</h2>
        <p>Download a copy of your profile and session metadata.</p>
        <a
          className="button button-outline"
          href="/api/account/export"
          download
        >
          Download data
        </a>
      </section>
      <section>
        <h2>Delete account</h2>
        <p>
          Confirmation by email is required. This permanently removes your
          account and signs out every session.
        </p>
        <form onSubmit={requestDeletion}>
          <label className="field">
            Type DELETE to confirm
            <input name="confirmation" autoComplete="off" required />
          </label>
          <button className="button button-outline" disabled={busy}>
            Request deletion
          </button>
        </form>
      </section>
      <button className="button button-ghost" onClick={() => void signOut()}>
        Sign out
      </button>
    </div>
  );
}
