export function getLocalizedField<T = string>(
  field: T | Record<string, T> | null | undefined,
  locale: string,
  fallbackLocale: string = "pt"
): T {
  if (!field) {
    return (typeof field === "string" ? "" : Array.isArray(field) ? [] : "") as T;
  }

  if (typeof field === "string" || Array.isArray(field)) {
    return field as T;
  }

  if (typeof field === "object") {
    const localizedValue = (field as Record<string, T>)[locale];
    if (localizedValue !== undefined && localizedValue !== null) {
      return localizedValue;
    }

    const fallbackValue = (field as Record<string, T>)[fallbackLocale];
    if (fallbackValue !== undefined && fallbackValue !== null) {
      return fallbackValue;
    }
  }

  return (typeof field === "string" ? "" : Array.isArray(field) ? [] : "") as T;
}
