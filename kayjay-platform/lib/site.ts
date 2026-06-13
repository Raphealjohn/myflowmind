export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export const SITE_NAME = "Kalevant Group";
export const SITE_DESCRIPTION =
  "Kalevant Group is a West Des Moines, Iowa holding company operating MyFlowMind, Kalevant Realty, Kalevant Notary Services, and Kalevant Security Consulting.";
