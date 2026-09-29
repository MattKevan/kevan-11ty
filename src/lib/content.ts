export type EntryData = Record<string, unknown> & {
  title?: string;
  description?: string;
  body?: string;
  bodyFormat?: string;
  date?: string | Date;
  image?: unknown;
  banner?: unknown;
  logo?: unknown;
  tags?: unknown;
  categories?: unknown;
  featured?: boolean | string | number;
};

export function imageUrl(value: unknown): string | undefined {
  if (typeof value === "string") return value || undefined;
  if (value && typeof value === "object") {
    const image = value as { src?: unknown; url?: unknown };
    for (const candidate of [image.src, image.url]) {
      if (typeof candidate === "string" && candidate) return candidate;
    }
  }
  return undefined;
}

export function listValue(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

export function isFeatured(value: unknown): boolean {
  return value === true || value === 1 || value === "1" || value === "true" || value === "True";
}

export function dateValue(value: unknown): Date | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function formatDate(value: unknown): string {
  const date = dateValue(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function byDateDescending<T extends { data?: EntryData; publishedAt?: string | Date }>(
  entries: T[],
): T[] {
  return [...entries].sort((a, b) => {
    const left = dateValue(a.data?.date ?? a.publishedAt)?.getTime() ?? 0;
    const right = dateValue(b.data?.date ?? b.publishedAt)?.getTime() ?? 0;
    return right - left;
  });
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
