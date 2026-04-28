import { test } from "@playwright/test";

test("admin dashboard is frozen outside the current MVP scope", () => {
  test.skip(
    true,
    "RT-012B: admin is frozen outside the public MVP scope; do not expect /pt/admin until RT-007 is reopened."
  );
});
