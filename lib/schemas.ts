import { z } from "zod";

const localizedTextSchema = z.object({
  pt: z.string().optional().default(""),
  en: z.string().optional().default(""),
  es: z.string().optional().default(""),
  sv: z.string().optional().default(""),
});

const localizedListSchema = z.object({
  pt: z.array(z.string()).optional().default([]),
  en: z.array(z.string()).optional().default([]),
  es: z.array(z.string()).optional().default([]),
  sv: z.array(z.string()).optional().default([]),
});

export const tripSchema = z
  .object({
    title: z.string().optional(),
    titleTranslations: localizedTextSchema.optional(),
    city: z.string().min(2, "Cidade e obrigatoria"),
    location: z.string().optional(),
    description: z.string().optional(),
    descriptionTranslations: localizedTextSchema.optional(),
    priceCents: z.coerce.number().min(0, "O preco nao pode ser negativo"),
    imageUrl: z.string().optional(),
    isPublished: z.boolean().optional().default(true),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    maxGuests: z.coerce.number().optional().nullable(),
    highlights: z.array(z.string()).optional(),
    highlightsTranslations: localizedListSchema.optional(),
  })
  .superRefine((value, ctx) => {
    const ptTitle = value.titleTranslations?.pt?.trim() || value.title?.trim() || "";

    if (ptTitle.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["titleTranslations", "pt"],
        message: "O titulo em PT deve ter pelo menos 3 caracteres",
      });
    }
  });

export type SupportedLocale = "pt" | "en" | "es" | "sv";
export type TripInput = z.infer<typeof tripSchema>;
