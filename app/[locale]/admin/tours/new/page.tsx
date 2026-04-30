'use client'

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createTripAction } from "@/app/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { TripInput } from "@/lib/schemas";

export default function NewTourPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const priceStr = formData.get("price") as string;
    const price = parseFloat(priceStr.replace(",", "."));

    const data: TripInput = {
      titleTranslations: {
        pt: formData.get("title_pt") as string,
        en: "",
        es: "",
        sv: "",
      },
      city: formData.get("city") as string,
      priceCents: Math.round(price * 100),
      imageUrl: (formData.get("imageUrl") as string) || "/images/placeholder.svg",
      highlightsTranslations: {
        pt: (formData.get("highlights_pt") as string).split("\n").filter(Boolean),
        en: [],
        es: [],
        sv: [],
      },
      descriptionTranslations: {
        pt: (formData.get("description_pt") as string) || "",
        en: "",
        es: "",
        sv: "",
      },
      isPublished: false,
    };

    try {
      const result = await createTripAction(data, locale);
      if (result.error) {
        setError(result.error);
      } else {
        router.push(`/${locale}/admin/tours`);
        router.refresh();
      }
    } catch {
      setError("Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/admin/tours`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Novo Tour</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Tour (Rascunho)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title_pt">Título (Português) *</Label>
              <Input id="title_pt" name="title_pt" required minLength={3} placeholder="Ex: Cristo Redentor + Mirante" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input id="city" name="city" required placeholder="Ex: Rio de Janeiro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input id="price" name="price" type="number" step="0.01" required placeholder="Ex: 245.00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem (Opcional)</Label>
              <Input id="imageUrl" name="imageUrl" placeholder="/images/trips/exemplo.jpg" />
              <p className="text-[10px] text-muted-foreground">O caminho deve começar com / ou ser uma URL completa.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_pt">Descrição (Português)</Label>
              <Textarea id="description_pt" name="description_pt" rows={4} placeholder="Conte detalhes sobre o passeio..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="highlights_pt">Destaques (Português - um por linha) *</Label>
              <Textarea id="highlights_pt" name="highlights_pt" rows={4} required placeholder="Ex: Guia credenciado&#10;Entrada inclusa&#10;Transporte climatizado" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline" type="button" asChild disabled={isLoading}>
              <Link href={`/${locale}/admin/tours`}>Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Tour"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
