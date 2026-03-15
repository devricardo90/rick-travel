const WHATSAPP_PHONE = "5521971168114";

type BuildWhatsAppQuoteUrlInput = {
  locale: string;
  tripTitle?: string;
  city?: string;
  scheduleLabel?: string;
  source?: "home" | "tour_detail" | "bookings";
};

function getLocalizedIntro(locale: string) {
  switch (locale) {
    case "en":
      return "Hello! I would like a quote for a tour with Rick Travel.";
    case "es":
      return "Hola. Me gustaria solicitar una cotizacion para un tour con Rick Travel.";
    case "sv":
      return "Hej! Jag vill be om en offert for en tur med Rick Travel.";
    default:
      return "Ola! Gostaria de solicitar um orcamento de passeio com a Rick Travel.";
  }
}

export function buildWhatsAppQuoteUrl({
  locale,
  tripTitle,
  city,
  scheduleLabel,
  source,
}: BuildWhatsAppQuoteUrlInput) {
  const lines = [getLocalizedIntro(locale)];

  if (tripTitle) {
    lines.push(`Passeio: ${tripTitle}`);
  }

  if (city) {
    lines.push(`Cidade: ${city}`);
  }

  if (scheduleLabel) {
    lines.push(`Data de interesse: ${scheduleLabel}`);
  }

  if (source) {
    lines.push(`Origem: ${source}`);
  }

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
}
