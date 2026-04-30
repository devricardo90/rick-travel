import { describe, expect, it, vi } from "vitest";

const requireAdminSessionMock = vi.hoisted(() => vi.fn());
const redirectMock = vi.hoisted(() =>
  vi.fn((url: string) => {
    const error = new Error("NEXT_REDIRECT") as Error & { digest: string };
    error.digest = `NEXT_REDIRECT;replace;${url};307;`;
    throw error;
  })
);

vi.mock("@/lib/authz", () => ({
  requireAdminSession: requireAdminSessionMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

import AdminLayout from "@/app/[locale]/admin/layout";
import { DomainError } from "@/lib/errors/domain-error";

function collectText(node: unknown): string {
  if (node == null || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(collectText).join(" ");
  }

  if (typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: unknown } }).props;
    return collectText(props?.children);
  }

  return "";
}

describe("AdminLayout authorization", () => {
  it("redirects anonymous users to login", async () => {
    requireAdminSessionMock.mockRejectedValueOnce(
      new DomainError("Nao autenticado", {
        code: "UNAUTHENTICATED",
        status: 401,
      })
    );

    await expect(
      AdminLayout({
        children: <div>Admin content</div>,
        params: Promise.resolve({ locale: "pt" }),
      })
    ).rejects.toMatchObject({
      digest: "NEXT_REDIRECT;replace;/pt/login?callbackUrl=/pt/admin;307;",
    });
  });

  it("renders controlled access denied content for authenticated non-admin users", async () => {
    requireAdminSessionMock.mockRejectedValueOnce(
      new DomainError("Nao autorizado", {
        code: "FORBIDDEN",
        status: 403,
      })
    );

    const result = await AdminLayout({
      children: <div>Admin content</div>,
      params: Promise.resolve({ locale: "pt" }),
    });

    expect(collectText(result)).toContain("Acesso negado");
    expect(collectText(result)).toContain("nao tem permissao");
    expect(collectText(result)).not.toContain("Admin content");
  });

  it("renders admin content for users with ADMIN role", async () => {
    requireAdminSessionMock.mockResolvedValueOnce({
      user: { role: "ADMIN" },
    });

    const result = await AdminLayout({
      children: <div>Admin content</div>,
      params: Promise.resolve({ locale: "pt" }),
    });

    expect(collectText(result)).toContain("Rick Travel Admin");
    expect(collectText(result)).toContain("Admin content");
  });
});
