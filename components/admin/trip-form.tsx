"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createTrip, updateTrip } from "@/app/[locale]/admin/trips/actions";
import { useLocale } from "next-intl";
import { LocalizedList, LocalizedText, TripFormDataLike } from "@/lib/types";

interface TripFormProps {
    initialData?: TripFormDataLike;
}

function getTextValue(value: string | LocalizedText | null | undefined): string {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value.pt || value.en || Object.values(value)[0] || "";
}

function getHighlightsAsString(highlights: string | string[] | LocalizedList | null | undefined): string {
    if (!highlights) return "";

    if (typeof highlights === "string") {
        if (highlights.startsWith("[") || highlights.startsWith("{")) {
            try {
                const parsed: unknown = JSON.parse(highlights);

                if (Array.isArray(parsed)) {
                    return parsed.filter((item): item is string => typeof item === "string").join("\n");
                }

                if (parsed && typeof parsed === "object") {
                    const localized = parsed as LocalizedList;
                    const preferred = localized.pt || localized.en || Object.values(localized)[0];
                    return Array.isArray(preferred) ? preferred.join("\n") : "";
                }
            } catch {
                return highlights;
            }
        }

        return highlights;
    }

    if (Array.isArray(highlights)) {
        return highlights.join("\n");
    }

    const preferred = highlights.pt || highlights.en || Object.values(highlights)[0];
    return Array.isArray(preferred) ? preferred.join("\n") : "";
}

export default function TripForm({ initialData }: TripFormProps) {
    const router = useRouter();
    const locale = useLocale();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: getTextValue(initialData?.title),
        city: initialData?.city || "",
        location: initialData?.location || "",
        description: getTextValue(initialData?.description),
        price: initialData?.priceCents ? (initialData.priceCents / 100).toFixed(2) : "",
        imageUrl: initialData?.imageUrl || "",
        startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split("T")[0] : "",
        endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : "",
        maxGuests: initialData?.maxGuests?.toString() || "",
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
            const highlightsArray = formData.highlights.split("\n").filter((line) => line.trim() !== "");
            const maxGuests = formData.maxGuests ? parseInt(formData.maxGuests, 10) : null;

            const payload = {
                title: formData.title,
                city: formData.city,
                location: formData.location || undefined,
                description: formData.description || undefined,
                priceCents,
                imageUrl: formData.imageUrl || undefined,
                startDate: formData.startDate || null,
                endDate: formData.endDate || null,
                maxGuests,
                highlights: highlightsArray,
            };

            const result = initialData?.id
                ? await updateTrip(initialData.id, payload)
                : await createTrip(payload);

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
            {error ? (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm border border-destructive/20">
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Titulo</label>
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
                    <label className="text-sm font-semibold text-foreground/80">Localizacao Especifica</label>
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Ex: Marina da Gloria"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Preco (R$)</label>
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
                    <label className="text-sm font-semibold text-foreground/80">Data Inicio</label>
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
                    <label className="text-sm font-semibold text-foreground/80">Max. Pessoas</label>
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
                <label className="text-sm font-semibold text-foreground/80">Descricao</label>
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
                    placeholder={"Cafe da manha incluso\nTransporte ida e volta"}
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
