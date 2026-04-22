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
    isPublished: initialData?.isPublished ?? true,
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
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" && "checked" in e.target
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
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
        isPublished: formData.isPublished,
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

  const activeLocaleKey = activeLocale.charAt(0).toUpperCase() + activeLocale.slice(1);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[30px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:p-8"
    >
      {error ? (
        <div className="rounded-[22px] border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="space-y-5 rounded-[26px] border border-white/8 bg-[#091d2c] p-5">
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">Dados principais</h2>
          <p className="mt-2 text-sm leading-7 text-white/56">
            Informacoes base do passeio para exibicao, precificacao e enquadramento editorial.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/74">Cidade</label>
            <input
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/34 hover:bg-white/[0.06] focus:border-white/18"
              placeholder="Ex: Rio de Janeiro"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/74">Preco (R$)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/34 hover:bg-white/[0.06] focus:border-white/18"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/74">Localizacao especifica</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/34 hover:bg-white/[0.06] focus:border-white/18"
              placeholder="Ex: Marina da Gloria"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/74">Max. pessoas</label>
            <input
              name="maxGuests"
              type="number"
              value={formData.maxGuests}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/34 hover:bg-white/[0.06] focus:border-white/18"
              placeholder="Ex: 10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/74">Data inicio</label>
            <input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors hover:bg-white/[0.06] focus:border-white/18"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/74">Data fim</label>
            <input
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors hover:bg-white/[0.06] focus:border-white/18"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-white/74">URL da imagem</label>
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/34 hover:bg-white/[0.06] focus:border-white/18"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <label className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] p-4 md:col-span-2">
            <input
              name="isPublished"
              type="checkbox"
              checked={formData.isPublished}
              onChange={handleChange}
              className="h-4 w-4 rounded border-white/20 bg-transparent"
            />
            <div>
              <div className="text-sm font-semibold text-white/82">Publicar na vitrine</div>
              <div className="text-xs leading-6 text-white/48">
                Quando desmarcado, o passeio fica oculto das listagens e buscas publicas.
              </div>
            </div>
          </label>
        </div>
      </section>

      <section className="space-y-5 rounded-[26px] border border-white/8 bg-[#091d2c] p-5">
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">Conteudo por idioma</h2>
          <p className="mt-2 text-sm leading-7 text-white/56">
            PT e a base editorial. EN, ES e SV podem ser preenchidos manualmente; se ficarem vazios, o sistema completa com traducao automatica e fallback.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {supportedLocales.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveLocale(item)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeLocale === item
                  ? "bg-[#123a28] text-white"
                  : "border border-white/10 bg-white/[0.04] text-white/68 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {localeLabels[item]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/74">
              Titulo ({localeLabels[activeLocale]})
            </label>
            <input
              name={`title${activeLocaleKey}`}
              required={activeLocale === "pt"}
              value={formData[`title${activeLocaleKey}` as keyof typeof formData] as string}
              onChange={handleChange}
              className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/34 hover:bg-white/[0.06] focus:border-white/18"
              placeholder={activeLocale === "pt" ? "Ex: Passeio de Barco" : "Opcional"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/74">
              Descricao ({localeLabels[activeLocale]})
            </label>
            <textarea
              name={`description${activeLocaleKey}`}
              rows={4}
              value={formData[`description${activeLocaleKey}` as keyof typeof formData] as string}
              onChange={handleChange}
              className="w-full rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-white outline-none transition-colors placeholder:text-white/34 hover:bg-white/[0.06] focus:border-white/18"
              placeholder={activeLocale === "pt" ? "Detalhes do passeio..." : "Opcional"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/74">
              Destaques ({localeLabels[activeLocale]}) - um por linha
            </label>
            <textarea
              name={`highlights${activeLocaleKey}`}
              rows={5}
              value={formData[`highlights${activeLocaleKey}` as keyof typeof formData] as string}
              onChange={handleChange}
              className="w-full rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-white outline-none transition-colors placeholder:text-white/34 hover:bg-white/[0.06] focus:border-white/18"
              placeholder={activeLocale === "pt" ? "Cafe da manha incluso\nTransporte ida e volta" : "Opcional"}
            />
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-col justify-end gap-3 border-t border-white/8 pt-5 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-5 text-white/72 hover:bg-white/[0.08] hover:text-white"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="h-12 rounded-2xl bg-[#123a28] px-8 text-white transition-colors hover:bg-[#184731]"
        >
          {loading ? "Salvando..." : "Salvar viagem"}
        </Button>
      </div>
    </form>
  );
}
