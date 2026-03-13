"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createTrip, updateTrip } from "@/app/[locale]/admin/trips/actions";
import { useLocale } from "next-intl";

interface TripFormProps {
    initialData?: {
        id?: string;
        title?: string;
        city?: string;
        location?: string | null;
        description?: string | null;
        priceCents?: number;
        imageUrl?: string | null;
        startDate?: string | Date | null;
        endDate?: string | Date | null;
        maxGuests?: number | null;
        highlights?: string | string[] | null;
    };
}

// Helper para garantir que highlights seja convertido corretamente
function getHighlightsAsString(highlights: string | string[] | null | undefined): string {
    if (!highlights) return "";

    // Se já é string, retorna direto
    if (typeof highlights === "string") {
        // Se parece com JSON, tenta parsear
        if (highlights.startsWith("[") || highlights.startsWith("{")) {
            try {
                const parsed = JSON.parse(highlights);
                return Array.isArray(parsed) ? parsed.join("\n") : "";
            } catch {
                return highlights;
            }
        }
        return highlights;
    }

    // Se é array, faz join
    if (Array.isArray(highlights)) {
        return highlights.join("\n");
    }

    return "";
    if (!highlights) return "";

    // Se já é string, retorna direto
    if (typeof highlights === "string") {
        // Se parece com JSON, tenta parsear
        if (highlights.startsWith("[") || highlights.startsWith("{")) {
            try {
                const parsed = JSON.parse(highlights);
                return Array.isArray(parsed) ? parsed.join("\n") : "";
            } catch {
                return highlights;
            }
        }
        return highlights;
    }

    // Se é array, faz join
    if (Array.isArray(highlights)) {
        return highlights.join("\n");
    }

    return "";
}

export default function TripForm({ initialData }: TripFormProps) {
    const router = useRouter();
    const locale = useLocale();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        city: initialData?.city || "",
        location: initialData?.location || "",
        description: initialData?.description || "",
        price: initialData?.priceCents ? (initialData.priceCents / 100).toFixed(2) : "",
        imageUrl: initialData?.imageUrl || "",
        startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
        endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
        maxGuests: initialData?.maxGuests || "",
        highlights: getHighlightsAsString(initialData?.highlights),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const priceCents = Math.round(parseFloat(formData.price) * 100);
            const highlightsArray = formData.highlights.split("\n").filter((line: string) => line.trim() !== "");
            const maxGuests = formData.maxGuests ? parseInt(formData.maxGuests.toString()) : null;

            const payload = {
                ...formData,
                priceCents,
                maxGuests,
                highlights: highlightsArray,
            };

            let result;

            if (initialData?.id) {
                result = await updateTrip(initialData.id, payload);
            } else {
                result = await createTrip(payload);
            }

            if (result.error) {
                throw new Error(result.error);
            }

            router.push(`/${locale}/admin/trips`);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erro ao salvar viagem");
        } finally {
            setLoading(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card p-6 rounded-xl shadow-sm border border-border">
            {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm border border-destructive/20">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Título</label>
                    <input
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Ex: Passeio de Barco"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Cidade</label>
                    <input
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Ex: Rio de Janeiro"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Localização Específica</label>
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Ex: Marina da Glória"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Preço (R$)</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="0.00"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Data Início</label>
                    <input
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Data Fim</label>
                    <input
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Máx. Pessoas</label>
                    <input
                        name="maxGuests"
                        type="number"
                        value={formData.maxGuests}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Ex: 10"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-foreground/80">URL da Imagem</label>
                    <input
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="https://exemplo.com/imagem.jpg"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Descrição</label>
                <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Detalhes do passeio..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Destaques (um por linha)</label>
                <textarea
                    name="highlights"
                    rows={4}
                    value={formData.highlights}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Café da manhã incluso&#10;Transporte ida e volta"
                />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg">
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="rounded-lg px-8">
                    {loading ? "Salvando..." : "Salvar Viagem"}
                </Button>
            </div>
        </form>
    );
}
