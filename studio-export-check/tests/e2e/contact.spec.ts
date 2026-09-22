import { expect, test } from "@playwright/test";

test("visitor can send a contact message", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Contact" }).click();
  await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
  await page.getByLabel("Name").fill("Test Visitor");
  await page.getByLabel("Email").fill("visitor@example.test");
  await page.getByLabel("Message").fill("Hello from the browser test");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Message received. Thank you.")).toBeVisible();
  expect(page.url()).not.toContain("visitor%40example.test");
});
