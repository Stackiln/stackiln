import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const fixture = join(root, "fixtures", "generated", "marketing");
const accountFixture = join(root, "fixtures", "generated", "accounts");
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const databaseUrl = "postgresql://site:site@localhost:5432/site";
const env = {
  ...process.env,
  DATABASE_URL: databaseUrl,
  APP_URL: "http://localhost:3000",
  APP_ENV: "local",
  CONTACT_EMAIL: "team@example.test",
  NEXT_TELEMETRY_DISABLED: "1",
};

function run(command, args, options = {}) {
  process.stdout.write(`\n> ${command} ${args.join(" ")}\n`);
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    env: options.env ?? env,
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    shell: process.platform === "win32" && command === pnpm,
  });
  if (result.status !== 0)
    throw new Error(
      options.capture
        ? result.stderr || result.stdout || `${command} failed`
        : `${command} exited ${result.status}`,
    );
  return result.stdout?.trim() ?? "";
}

run(pnpm, ["typecheck"]);
run(pnpm, ["test"]);
run(pnpm, ["lint"]);
run(pnpm, ["install", "--frozen-lockfile"], { cwd: fixture });
run(pnpm, ["exec", "playwright", "install", "chromium"], { cwd: fixture });
run("docker", [
  "compose",
  "-f",
  join(fixture, "compose.yaml"),
  "up",
  "-d",
  "--wait",
  "db",
]);
run(pnpm, ["db:migrate"], { cwd: fixture });
run(pnpm, ["verify"], { cwd: fixture });
run(pnpm, ["stackiln", "doctor", fixture]);
const accountDatabase = run(
  "docker",
  [
    "compose",
    "-f",
    join(fixture, "compose.yaml"),
    "exec",
    "-T",
    "db",
    "psql",
    "-U",
    "site",
    "-d",
    "postgres",
    "-tAc",
    "SELECT 1 FROM pg_database WHERE datname='site_accounts'",
  ],
  { capture: true },
);
if (accountDatabase !== "1")
  run("docker", [
    "compose",
    "-f",
    join(fixture, "compose.yaml"),
    "exec",
    "-T",
    "db",
    "psql",
    "-U",
    "site",
    "-d",
    "postgres",
    "-c",
    "CREATE DATABASE site_accounts",
  ]);
const accountEnv = {
  ...env,
  DATABASE_URL: "postgresql://site:site@localhost:5432/site_accounts",
  BETTER_AUTH_SECRET: "local-verification-secret-32-characters-minimum",
};
run(pnpm, ["install", "--frozen-lockfile"], {
  cwd: accountFixture,
  env: accountEnv,
});
run(pnpm, ["db:migrate"], { cwd: accountFixture, env: accountEnv });
const schemaCheck = run(pnpm, ["db:generate"], {
  cwd: accountFixture,
  env: accountEnv,
  capture: true,
});
if (!schemaCheck.includes("No schema changes"))
  throw new Error(
    "Account fixture schema differs from its checked-in migration",
  );
run(pnpm, ["verify"], { cwd: accountFixture, env: accountEnv });
run(pnpm, ["stackiln", "doctor", accountFixture], { env: accountEnv });
run("docker", ["build", "-t", "stackiln-marketing-verify", fixture]);

const container = `stackiln-verify-${process.pid}`;
try {
  run("docker", [
    "run",
    "-d",
    "--rm",
    "--name",
    container,
    "--add-host=host.docker.internal:host-gateway",
    "-e",
    "DATABASE_URL=postgresql://site:site@host.docker.internal:5432/site",
    "-e",
    "APP_URL=http://localhost:3000",
    "-e",
    "APP_ENV=local",
    "-e",
    "CONTACT_EMAIL=team@example.test",
    "stackiln-marketing-verify",
  ]);
  const smoke = `const sleep=ms=>new Promise(r=>setTimeout(r,ms)); for(let attempt=0;attempt<20;attempt++){try{for(const path of ['/','/health/live','/health/ready']){const response=await fetch('http://localhost:3000'+path);if(!response.ok)throw Error(path+' '+response.status)} const contact=await fetch('http://localhost:3000/api/contact',{method:'POST',headers:{origin:'http://localhost:3000','content-type':'application/json'},body:JSON.stringify({name:'Smoke',email:'smoke@example.test',message:'Container test'})});if(!contact.ok)throw Error('contact '+contact.status);process.exit(0)}catch(error){if(attempt===19)throw error;await sleep(1000)}}`;
  run("docker", [
    "exec",
    container,
    "node",
    "--input-type=module",
    "-e",
    smoke,
  ]);
} finally {
  spawnSync("docker", ["stop", container], { stdio: "ignore" });
}
process.stdout.write(
  "\nStackiln, marketing, accounts, database, browser, and container checks passed.\n",
);
