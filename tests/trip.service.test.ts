import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  trip: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  booking: {
    count: vi.fn(),
  },
}));

const translateTextWithMetaMock = vi.hoisted(() => vi.fn());
const translateArrayWithMetaMock = vi.hoisted(() => vi.fn());
const logTranslationJobMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("@/lib/translation-service", () => ({
  translateTextWithMeta: translateTextWithMetaMock,
  translateArrayWithMeta: translateArrayWithMetaMock,
  logTranslationJob: logTranslationJobMock,
}));

import { DomainError } from "@/lib/errors/domain-error";
import { createTripRecord, deleteTripRecord } from "@/lib/services/trip.service";

describe("trip.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    translateTextWithMetaMock.mockImplementation(async (text: string) => ({
      translations: {
        pt: text,
        en: `${text} EN`,
        es: `${text} ES`,
        sv: `${text} SV`,
      },
      meta: {
        provider: "MOCK_TRANSLATOR",
        status: "SUCCESS",
        failures: [],
        sourceLocale: "pt",
      },
    }));

    translateArrayWithMetaMock.mockImplementation(async (items: string[]) => ({
      translations: {
        pt: items,
        en: items.map((item) => `${item} EN`),
        es: items.map((item) => `${item} ES`),
        sv: items.map((item) => `${item} SV`),
      },
      meta: {
        provider: "MOCK_TRANSLATOR",
        status: "SUCCESS",
        failures: [],
        sourceLocale: "pt",
      },
    }));
  });

  it("keeps manual translations and auto-fills only missing locales", async () => {
    prismaMock.trip.create.mockResolvedValue({
      id: "trip-1",
      title: {
        pt: "Passeio de barco",
        en: "Boat Tour",
        es: "Passeio de barco ES",
        sv: "Passeio de barco SV",
      },
    });

    await createTripRecord({
      title: "Passeio de barco",
      titleTranslations: {
        pt: "Passeio de barco",
        en: "Boat Tour",
        es: "",
        sv: "",
      },
      city: "Rio de Janeiro",
      location: "Marina",
      description: "Descricao base",
      descriptionTranslations: {
        pt: "Descricao base",
        en: "Base description",
        es: "",
        sv: "",
      },
      priceCents: 10000,
      isPublished: true,
      imageUrl: "https://example.com/trip.jpg",
      startDate: "2026-03-21",
      endDate: "2026-03-22",
      maxGuests: 10,
      highlights: ["Cafe"],
      highlightsTranslations: {
        pt: ["Cafe"],
        en: ["Breakfast"],
        es: [],
        sv: [],
      },
    });

    expect(prismaMock.trip.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: {
            pt: "Passeio de barco",
            en: "Boat Tour",
            es: "Passeio de barco ES",
            sv: "Passeio de barco SV",
          },
          description: {
            pt: "Descricao base",
            en: "Base description",
            es: "Descricao base ES",
            sv: "Descricao base SV",
          },
          highlights: {
            pt: ["Cafe"],
            en: ["Breakfast"],
            es: ["Cafe ES"],
            sv: ["Cafe SV"],
          },
        }),
      })
    );

    expect(logTranslationJobMock).toHaveBeenCalled();
  });

  it("blocks trip deletion when there are active bookings", async () => {
    prismaMock.booking.count.mockResolvedValue(2);

    await expect(deleteTripRecord("trip-1")).rejects.toMatchObject({
      code: "TRIP_HAS_ACTIVE_BOOKINGS",
    } satisfies Partial<DomainError>);
  });
});
