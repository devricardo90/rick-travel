"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface TripFormProps {
    initialData?: any; // Tipar melhor depois se sobrar tempo
}

export default function TripForm({ initialData }: TripFormProps) {
    const router = useRouter();
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
        highlights: initialData?.highlights ? initialData.highlights.join("\n") : "",
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

            const payload = {
                ...formData,
                priceCents,
                highlights: highlightsArray,
            };

            const res = await fetch("/api/trips", {
                method: "POST", // TODO: Adicionar PUT para edição se initialData existir
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Erro ao salvar viagem");
            }

            router.push("/admin/trips");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg shadow-sm border">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Título</label>
                    <input
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="Ex: Passeio de Barco"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Cidade</label>
                    <input
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="Ex: Rio de Janeiro"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Localização Específica</label>
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="Ex: Marina da Glória"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Preço (R$)</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="0.00"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Data Início</label>
                    <input
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Data Fim</label>
                    <input
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Máx. Pessoas</label>
                    <input
                        name="maxGuests"
                        type="number"
                        value={formData.maxGuests}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="Ex: 10"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">URL da Imagem</label>
                    <input
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="https://exemplo.com/imagem.jpg"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Detalhes do passeio..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Destaques (um por linha)</label>
                <textarea
                    name="highlights"
                    rows={4}
                    value={formData.highlights}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Café da manhã incluso&#10;Transporte ida e volta"
                />
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Viagem"}
                </Button>
            </div>
        </form>
    );
}
