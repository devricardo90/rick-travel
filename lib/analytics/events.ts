export const ANALYTICS_EVENT_TYPES = [
  "TOUR_VIEWED",
  "RESERVE_CLICKED",
  "CHECKOUT_STARTED",
  "PIX_GENERATED",
  "PAYMENT_CONFIRMED",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_TYPES)[number];

export const ANALYTICS_EVENT_LABELS: Record<AnalyticsEventName, string> = {
  TOUR_VIEWED: "Tour visualizado",
  RESERVE_CLICKED: "Clique em reservar",
  CHECKOUT_STARTED: "Checkout iniciado",
  PIX_GENERATED: "Pix gerado",
  PAYMENT_CONFIRMED: "Pagamento confirmado",
};
