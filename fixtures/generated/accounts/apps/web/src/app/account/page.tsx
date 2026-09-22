import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AccountActions } from "./account-actions";

export const metadata: Metadata = { title: "Account" };
export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  return (
    <div className="content-page account-page">
      <h1>Account</h1>
      <p>{session.user.email}</p>
      <AccountActions name={session.user.name} email={session.user.email} />
    </div>
  );
}
