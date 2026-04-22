import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  booking: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  paymentAttempt: {
    create: vi.fn(),
    update: vi.fn(),
  },
  $transaction: vi.fn(),
}));

const sendPaymentConfirmedEmailMock = vi.hoisted(() => vi.fn());
const trackAnalyticsEventMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("@/lib/services/email.service", () => ({
  sendPaymentConfirmedEmail: sendPaymentConfirmedEmailMock,
}));

vi.mock("@/lib/services/analytics.service", () => ({
  trackAnalyticsEvent: trackAnalyticsEventMock,
}));

import { DomainError } from "@/lib/errors/domain-error";
import {
  createMercadoPagoPixPayment,
  getCheckoutEntryForBooking,
  processPaymentWebhook,
} from "@/lib/services/payment.service";

describe("payment.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MP_ACCESS_TOKEN = "test-token";
  });

  it("returns a checkout entry for a payable booking", async () => {
    prismaMock.booking.findUnique.mockResolvedValue({
      id: "booking-1",
      userId: "user-1",
      status: "PENDING",
      paymentStatus: "UNPAID",
    });

    const result = await getCheckoutEntryForBooking(
      "user-1",
      "booking-1",
      "http://localhost:3000",
      "pt"
    );

    expect(result).toEqual({
      bookingId: "booking-1",
      checkoutUrl: "http://localhost:3000/pt/payments/mercadopago/booking-1",
    });
  });

  it("rejects pix creation with invalid CPF", async () => {
    prismaMock.booking.findUnique.mockResolvedValue({
      id: "booking-1",
      userId: "user-1",
      tripId: "trip-1",
      status: "PENDING",
      paymentStatus: "UNPAID",
      totalPriceCents: 10000,
      user: { email: "rick@gmail.com", name: "Rick Travel" },
      trip: { title: { pt: "Passeio" }, city: "Rio" },
      schedule: null,
      paymentAttempts: [],
    });

    await expect(
      createMercadoPagoPixPayment({
        userId: "user-1",
        bookingId: "booking-1",
        origin: "http://localhost:3000",
        payerDocument: "123",
      })
    ).rejects.toMatchObject({
      code: "INVALID_PAYER_DOCUMENT",
    } satisfies Partial<DomainError>);
  });

  it("confirms booking and emits side effects on succeeded webhook", async () => {
    prismaMock.booking.findUnique.mockResolvedValue({
      id: "booking-1",
      userId: "user-1",
      tripId: "trip-1",
      status: "PENDING",
      paymentStatus: "UNPAID",
      totalPriceCents: 15000,
      paymentAttempts: [
        {
          id: "attempt-1",
          providerPaymentId: "mp-1",
        },
      ],
    });

    prismaMock.$transaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) =>
      callback({
        paymentAttempt: {
          update: prismaMock.paymentAttempt.update.mockResolvedValue({
            id: "attempt-1",
            status: "SUCCEEDED",
          }),
        },
        booking: {
          update: prismaMock.booking.update.mockResolvedValue({
            id: "booking-1",
            status: "CONFIRMED",
            paymentStatus: "PAID",
          }),
        },
      })
    );

    const result = await processPaymentWebhook({
      bookingId: "booking-1",
      status: "SUCCEEDED",
      providerPaymentId: "mp-1",
      providerEventId: "event-1",
    });

    expect(sendPaymentConfirmedEmailMock).toHaveBeenCalledWith("booking-1");
    expect(trackAnalyticsEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "PAYMENT_CONFIRMED",
        bookingId: "booking-1",
        tripId: "trip-1",
      })
    );
    expect(result.updatedBooking).toMatchObject({
      status: "CONFIRMED",
      paymentStatus: "PAID",
    });
  });
});
