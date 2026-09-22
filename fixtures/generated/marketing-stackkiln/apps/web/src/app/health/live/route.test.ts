import { expect, test } from "vitest";
import { GET } from "./route";

test("liveness route reports a healthy process", async () => {
  const response = GET();
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ status: "ok" });
});
