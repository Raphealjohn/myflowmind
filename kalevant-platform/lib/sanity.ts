import { createClient, type SanityClient } from "@sanity/client";

let client: SanityClient | null = null;

export function sanityConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
}

function getClient(): SanityClient {
  if (!client) {
    client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      apiVersion: "2024-10-01",
      useCdn: true,
    });
  }
  return client;
}

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return getClient().fetch<T>(query, params, { next: { revalidate: 300 } });
}
