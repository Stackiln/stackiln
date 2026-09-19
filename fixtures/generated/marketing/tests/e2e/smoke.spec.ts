import { expect, test } from "@playwright/test";
import config from "../../factory.config.json";

test("homepage shows the product and main navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(config.product.name);
  await expect(page.getByRole("main")).toBeVisible();
});
