function requireE2EEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} must be set explicitly before running E2E setup.`);
  }

  return value;
}

export const E2E_ADMIN_EMAIL = requireE2EEnv("E2E_ADMIN_EMAIL");
export const E2E_ADMIN_PASSWORD = requireE2EEnv("E2E_ADMIN_PASSWORD");

export const E2E_USER_EMAIL =
  process.env.E2E_USER_EMAIL ?? "e2e-user@ricktravel.local";
export const E2E_USER_PASSWORD =
  process.env.E2E_USER_PASSWORD ?? "E2E_User_123!";

export const E2E_TRIP_TITLE = "TESTE E2E - NAO USAR";
export const E2E_DATA_FILE = ".e2e-data.json";
