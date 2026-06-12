export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export const SITE_NAME = "Kayjay Holding";
export const SITE_DESCRIPTION =
  "Kayjay Holding is a West Des Moines, Iowa holding company operating MyFlowMind, Kayjay Realty, Kayjay Notary Services, and Kayjay Security Consulting.";
