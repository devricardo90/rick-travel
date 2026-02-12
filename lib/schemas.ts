import { z } from "zod";

export const tripSchema = z.object({
    title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
    city: z.string().min(2, "Cidade é obrigatória"),
    location: z.string().optional(),
    description: z.string().optional(),
    priceCents: z.coerce.number().min(0, "O preço não pode ser negativo"),
    imageUrl: z.string().optional(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    maxGuests: z.coerce.number().optional().nullable(),
    highlights: z.array(z.string()).optional(),
});

export type TripInput = z.infer<typeof tripSchema>;
