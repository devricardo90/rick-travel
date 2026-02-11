

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: { enabled: true },

  user: {
    modelName: "User",
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
      },
    },
  },

  session: {
    modelName: "Session",
    expiresIn: 60 * 60 * 24, // 1 dia
    updateAge: 60 * 30,     // renova a cada 30 min se ativo
  },

  account: { modelName: "Account" },
  verification: { modelName: "Verification" },

  plugins: [nextCookies()],
});

