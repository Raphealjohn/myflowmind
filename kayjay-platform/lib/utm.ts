import type { UtmParams } from "@/lib/crm/types";

export const UTM_COOKIE = "kj_utm";
export const RETURN_VISIT_COOKIE = "kj_seen";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export function parseUtmCookie(raw: string | undefined): UtmParams {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (typeof parsed !== "object" || parsed === null) return {};
    const utm: UtmParams = {};
    for (const key of UTM_KEYS) {
      const value = (parsed as Record<string, unknown>)[key];
      if (typeof value === "string" && value.length <= 200) utm[key] = value;
    }
    return utm;
  } catch {
    return {};
  }
}

export function utmFromSearchParams(params: URLSearchParams): UtmParams {
  const utm: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 200);
  }
  return utm;
}
