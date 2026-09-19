import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  use: { baseURL: "http://127.0.0.1:3100", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ],
  webServer: {
    command: "pnpm --filter web dev --port 3100",
    url: "http://127.0.0.1:3100/health/live",
    reuseExistingServer: false,
    timeout: 120_000,
    env: { APP_URL: "http://127.0.0.1:3100", APP_ENV: "local", CONTACT_EMAIL: "team@example.test" }
  }
});
