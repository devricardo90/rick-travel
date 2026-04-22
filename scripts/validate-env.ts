import dotenv from "dotenv";

dotenv.config();

type Target = "local" | "staging" | "production";

const target = parseTarget(process.argv);
const commonRequired = ["DATABASE_URL", "BETTER_AUTH_URL", "BETTER_AUTH_SECRET"] as const;
const externalRequired = ["RESEND_API_KEY", "MP_ACCESS_TOKEN"] as const;
const optional = ["MP_WEBHOOK_SECRET"] as const;
const required = target === "local" ? commonRequired : [...commonRequired, ...externalRequired];
const failures: string[] = [];
const warnings: string[] = [];

for (const key of required) {
  const value = process.env[key];

  if (!value) {
    failures.push(`${key} is required for ${target}`);
    continue;
  }

  if (isPlaceholder(value)) {
    failures.push(`${key} still looks like a placeholder`);
  }
}

for (const key of optional) {
  const value = process.env[key];

  if (!value) {
    warnings.push(`${key} is optional but recommended for webhook verification`);
  } else if (isPlaceholder(value)) {
    warnings.push(`${key} still looks like a placeholder`);
  }
}

validateUrl("BETTER_AUTH_URL", failures);
validateDatabaseUrl("DATABASE_URL", failures);
validateSecretLength("BETTER_AUTH_SECRET", failures);

if (target !== "local" && process.env.BETTER_AUTH_URL?.includes("localhost")) {
  failures.push("BETTER_AUTH_URL must not point to localhost outside local target");
}

for (const warning of warnings) {
  console.warn(`WARN ${warning}`);
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  process.exit(1);
}

console.log(`Environment validation OK for ${target}`);

function parseTarget(argv: string[]): Target {
  const arg = argv.find((value) => value.startsWith("--target="));
  const value = arg?.split("=")[1] ?? "local";

  if (value === "local" || value === "staging" || value === "production") {
    return value;
  }

  console.error("FAIL --target must be one of local, staging, production");
  process.exit(1);
}

function isPlaceholder(value: string) {
  return /replace-with|example|your-|seu-|sua-|placeholder/i.test(value);
}

function validateUrl(key: string, failures: string[]) {
  const value = process.env[key];
  if (!value) return;

  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) {
      failures.push(`${key} must use http or https`);
    }
  } catch {
    failures.push(`${key} must be a valid URL`);
  }
}

function validateDatabaseUrl(key: string, failures: string[]) {
  const value = process.env[key];
  if (!value) return;

  try {
    const url = new URL(value);
    if (!["postgres:", "postgresql:"].includes(url.protocol)) {
      failures.push(`${key} must use a PostgreSQL connection string`);
    }
  } catch {
    failures.push(`${key} must be a valid PostgreSQL connection string`);
  }
}

function validateSecretLength(key: string, failures: string[]) {
  const value = process.env[key];
  if (!value) return;

  if (value.length < 32) {
    failures.push(`${key} must be at least 32 characters`);
  }
}
