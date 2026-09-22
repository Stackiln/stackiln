import { randomUUID } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const mailbox = join(process.cwd(), "apps/web/.local-mailbox");
async function messageUrl(address: string, subject: string): Promise<string> {
  let files: string[];
  try {
    files = await readdir(mailbox);
  } catch {
    return "";
  }
  for (const file of files) {
    const message = JSON.parse(await readFile(join(mailbox, file), "utf8")) as {
      to: string;
      subject: string;
      text: string;
    };
    if (message.to !== address || message.subject !== subject) continue;
    return message.text.match(/https?:\/\/\S+/)?.[0] ?? "";
  }
  return "";
}

test("account verification, recovery, sessions, export and deletion", async ({
  page,
  browser,
}) => {
  let address = `account-${randomUUID()}@example.test`;
  const password = `Start-${randomUUID()}`;
  const nextPassword = `Next-${randomUUID()}`;
  const finalPassword = `Final-${randomUUID()}`;
  await page.goto("/account");
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.getByRole("link", { name: "Create account" }).click();
  await page.getByLabel("Name").fill("Test Member");
  await page.getByLabel("Email").fill(address);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("status")).toContainText("Check your email");
  await expect
    .poll(() => messageUrl(address, "Verify your email"))
    .not.toBe("");
  await page.goto(await messageUrl(address, "Verify your email"));
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(address);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/account$/);
  await page.getByLabel("Name").fill("Updated Member");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByRole("status")).toContainText("Profile saved");
  const nextAddress = `changed-${randomUUID()}@example.test`;
  await page.getByLabel("New email").fill(nextAddress);
  await page.getByRole("button", { name: "Change email" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Check your current email",
  );
  await expect
    .poll(() => messageUrl(address, "Approve email change"))
    .not.toBe("");
  await page.goto(await messageUrl(address, "Approve email change"));
  await expect
    .poll(() => messageUrl(nextAddress, "Verify your email"))
    .not.toBe("");
  await page.goto(await messageUrl(nextAddress, "Verify your email"));
  address = nextAddress;
  await page.goto("/account");
  await expect(page.getByText(address, { exact: true })).toBeVisible();
  await page.getByLabel("Current password").fill(password);
  await page.getByLabel("New password").fill(nextPassword);
  await page.getByRole("button", { name: "Change password" }).click();
  await expect(page.getByRole("status")).toContainText("Password changed");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.getByRole("link", { name: "Forgot password?" }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);
  await page.getByLabel("Email").fill(address);
  await page.getByRole("button", { name: "Reset password" }).click();
  await expect(page.getByRole("status")).toContainText(
    "If that address has an account",
    { timeout: 15_000 },
  );
  await expect
    .poll(() => messageUrl(address, "Reset your password"))
    .not.toBe("");
  await page.goto(await messageUrl(address, "Reset your password"));
  await expect(
    page.getByRole("heading", { name: "Choose a new password" }),
  ).toBeVisible();
  await page.getByLabel("Password").fill(finalPassword);
  await page.getByRole("button", { name: "Choose a new password" }).click();
  await expect(page.getByRole("status")).toContainText("Password changed");
  await page.getByRole("link", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.getByLabel("Email").fill(address);
  await page.getByLabel("Password").fill(finalPassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/account$/);

  const exported = await page.request.get("/api/account/export");
  expect(exported.status()).toBe(200);
  expect(exported.headers()["cache-control"]).toContain("no-store");
  expect((await exported.json()).profile.email).toBe(address);
  const remote = await browser.newContext({ userAgent: "Remote-Test-Session" });
  try {
    const remotePage = await remote.newPage();
    expect((await remote.request.get("/api/account/export")).status()).toBe(
      401,
    );
    await remotePage.goto("/sign-in");
    await remotePage.getByLabel("Email").fill(address);
    await remotePage.getByLabel("Password").fill(finalPassword);
    await remotePage.getByRole("button", { name: "Sign in" }).click();
    await expect(remotePage).toHaveURL(/\/account$/);
    await page.reload();
    const remoteSession = page
      .locator(".session-list li")
      .filter({ hasText: "Remote-Test-Session" });
    await expect(remoteSession).toBeVisible();
    await remoteSession.getByRole("button", { name: "Revoke" }).click();
    await expect(page.getByRole("status")).toContainText("Session revoked");
    await remotePage.goto("/account");
    await expect(remotePage).toHaveURL(/\/sign-in$/);
  } finally {
    await remote.close();
  }

  await page.getByLabel("Type DELETE to confirm").fill("DELETE");
  await page.getByRole("button", { name: "Request deletion" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Check your email to confirm account deletion",
  );
  await expect
    .poll(() => messageUrl(address, "Confirm account deletion"))
    .not.toBe("");
  await page.goto(await messageUrl(address, "Confirm account deletion"));
  await page.goto("/account");
  await expect(page).toHaveURL(/\/sign-in$/);
});
