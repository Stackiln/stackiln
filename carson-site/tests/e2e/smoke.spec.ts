import { expect, test } from "@playwright/test";
test("homepage shows Carson's briefing and operating limits", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Carson");
  await expect(
    page.getByRole("heading", { name: "The numbers on the clipboard" }),
  ).toBeVisible();
  await expect(
    page.getByText("maximum output tokens per AI reply"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Protocol", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
