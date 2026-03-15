"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { createTrip, updateTrip } from "@/app/[locale]/admin/trips/actions";
import { Button } from "@/components/ui/button";
import { LocalizedList, LocalizedText, TripFormDataLike } from "@/lib/types";

interface TripFormProps {
  initialData?: TripFormDataLike;
}

const supportedLocales = ["pt", "en", "es", "sv"] as const;
const localeLabels: Record<(typeof supportedLocales)[number], string> = {
  pt: "Portugues",
  en: "English",
  es: "Espanol",
  sv: "Svenska",
};

function getLocalizedTextValue(
  value: string | LocalizedText | null | undefined,
  locale: (typeof supportedLocales)[number]
) {
  if (!value) return "";
  if (typeof value === "string") return locale === "pt" ? value : "";
  return value[locale] || "";
}

function getLocalizedListValue(
  value: string | string[] | LocalizedList | null | undefined,
  locale: (typeof supportedLocales)[number]
) {
  if (!value) return "";

  if (typeof value === "string") {
    return locale === "pt" ? value : "";
  }

  if (Array.isArray(value)) {
    return locale === "pt" ? value.join("\n") : "";
  }

  return Array.isArray(value[locale]) ? value[locale].join("\n") : "";
}

export default function TripForm({ initialData }: TripFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeLocale, setActiveLocale] = useState<(typeof supportedLocales)[number]>("pt");

  const [formData, setFormData] = useState({
    city: initialData?.city || "",
    location: initialData?.location || "",
    price: initialData?.priceCents ? (initialData.priceCents / 100).toFixed(2) : "",
    imageUrl: initialData?.imageUrl || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split("T")[0] : "",
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : "",
    maxGuests: initialData?.maxGuests?.toString() || "",
    titlePt: getLocalizedTextValue(initialData?.titleTranslations ?? initialData?.title, "pt"),
    titleEn: getLocalizedTextValue(initialData?.titleTranslations ?? initialData?.title, "en"),
    titleEs: getLocalizedTextValue(initialData?.titleTranslations ?? initialData?.title, "es"),
    titleSv: getLocalizedTextValue(initialData?.titleTranslations ?? initialData?.title, "sv"),
    descriptionPt: getLocalizedTextValue(
      initialData?.descriptionTranslations ?? initialData?.description,
      "pt"
    ),
    descriptionEn: getLocalizedTextValue(
      initialData?.descriptionTranslations ?? initialData?.description,
      "en"
    ),
    descriptionEs: getLocalizedTextValue(
      initialData?.descriptionTranslations ?? initialData?.description,
      "es"
    ),
    descriptionSv: getLocalizedTextValue(
      initialData?.descriptionTranslations ?? initialData?.description,
      "sv"
    ),
    highlightsPt: getLocalizedListValue(
      initialData?.highlightsTranslations ?? initialData?.highlights,
      "pt"
    ),
    highlightsEn: getLocalizedListValue(
      initialData?.highlightsTranslations ?? initialData?.highlights,
      "en"
    ),
    highlightsEs: getLocalizedListValue(
      initialData?.highlightsTranslations ?? initialData?.highlights,
      "es"
    ),
    highlightsSv: getLocalizedListValue(
      initialData?.highlightsTranslations ?? initialData?.highlights,
      "sv"
    ),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const parseList = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const priceCents = Math.round(parseFloat(formData.price) * 100);
      const maxGuests = formData.maxGuests ? parseInt(formData.maxGuests, 10) : null;

      const payload = {
        title: formData.titlePt,
        titleTranslations: {
          pt: formData.titlePt,
          en: formData.titleEn,
          es: formData.titleEs,
          sv: formData.titleSv,
        },
        city: formData.city,
        location: formData.location || undefined,
        description: formData.descriptionPt || undefined,
        descriptionTranslations: {
          pt: formData.descriptionPt,
          en: formData.descriptionEn,
          es: formData.descriptionEs,
          sv: formData.descriptionSv,
        },
        priceCents,
        imageUrl: formData.imageUrl || undefined,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        maxGuests,
        highlights: parseList(formData.highlightsPt),
        highlightsTranslations: {
          pt: parseList(formData.highlightsPt),
          en: parseList(formData.highlightsEn),
          es: parseList(formData.highlightsEs),
          sv: parseList(formData.highlightsSv),
        },
      };

      const result = initialData?.id ? await updateTrip(initialData.id, payload) : await createTrip(payload);

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
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      {error ? (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Cidade</label>
          <input
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background p-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Ex: Rio de Janeiro"
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
            className="w-full rounded-lg border border-border bg-background p-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Localizacao especifica</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background p-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Ex: Marina da Gloria"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Max. pessoas</label>
          <input
            name="maxGuests"
            type="number"
            value={formData.maxGuests}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background p-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Ex: 10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Data inicio</label>
          <input
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background p-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Data fim</label>
          <input
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background p-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-foreground/80">URL da imagem</label>
          <input
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background p-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>
      </div>

      <section className="space-y-4 rounded-xl border border-border/80 bg-muted/20 p-4">
        <div>
          <h2 className="text-lg font-semibold">Conteudo por idioma</h2>
          <p className="text-sm text-muted-foreground">
            PT e a base editorial. EN, ES e SV podem ser preenchidos manualmente; se ficarem vazios, o sistema completa com traducao automatica e fallback.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {supportedLocales.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveLocale(item)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                activeLocale === item
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground/80 hover:bg-muted"
              }`}
            >
              {localeLabels[item]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">
              Titulo ({localeLabels[activeLocale]})
            </label>
            <input
              name={`title${activeLocale.charAt(0).toUpperCase()}${activeLocale.slice(1)}`}
              required={activeLocale === "pt"}
              value={
                formData[`title${activeLocale.charAt(0).toUpperCase()}${activeLocale.slice(1)}` as keyof typeof formData] as string
              }
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background p-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder={activeLocale === "pt" ? "Ex: Passeio de Barco" : "Opcional"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">
              Descricao ({localeLabels[activeLocale]})
            </label>
            <textarea
              name={`description${activeLocale.charAt(0).toUpperCase()}${activeLocale.slice(1)}`}
              rows={4}
              value={
                formData[
                  `description${activeLocale.charAt(0).toUpperCase()}${activeLocale.slice(1)}` as keyof typeof formData
                ] as string
              }
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background p-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder={activeLocale === "pt" ? "Detalhes do passeio..." : "Opcional"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">
              Destaques ({localeLabels[activeLocale]}) - um por linha
            </label>
            <textarea
              name={`highlights${activeLocale.charAt(0).toUpperCase()}${activeLocale.slice(1)}`}
              rows={5}
              value={
                formData[
                  `highlights${activeLocale.charAt(0).toUpperCase()}${activeLocale.slice(1)}` as keyof typeof formData
                ] as string
              }
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background p-2.5 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder={activeLocale === "pt" ? "Cafe da manha incluso\nTransporte ida e volta" : "Opcional"}
            />
          </div>
        </div>
      </section>

      <div className="mt-6 flex justify-end gap-4 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="rounded-lg px-8">
          {loading ? "Salvando..." : "Salvar viagem"}
        </Button>
      </div>
    </form>
  );
}
