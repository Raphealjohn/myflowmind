import { NextResponse } from "next/server";
import { captureLead } from "@/lib/leads";
import { resourceSchema } from "@/lib/validation";
import { getResource } from "@/lib/resources";
import { sendEmail } from "@/lib/email";
import ResourceDelivery from "@/emails/resource-delivery";
import { siteUrl } from "@/lib/site";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = resourceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const resource = getResource(parsed.data.resourceSlug);
  if (!resource) {
    return NextResponse.json({ ok: false, message: "Unknown resource" }, { status: 404 });
  }

  try {
    await captureLead({
      email: parsed.data.email,
      firstName: parsed.data.firstName || undefined,
      subsidiary: resource.subsidiary,
      intent: "resource_download",
      sourcePage: parsed.data.sourcePage,
      consent: parsed.data.consent,
      signals: { downloadedResource: true },
    });

    const downloadUrl = `${siteUrl()}${resource.downloadPath}`;
    await sendEmail({
      to: parsed.data.email,
      subject: `Your download: ${resource.title}`,
      react: ResourceDelivery({
        firstName: parsed.data.firstName || undefined,
        resourceTitle: resource.title,
        downloadUrl,
        unsubscribeUrl: `${siteUrl()}/api/unsubscribe?email=${encodeURIComponent(parsed.data.email)}`,
      }),
    });

    return NextResponse.json({ ok: true, downloadUrl: resource.downloadPath });
  } catch (error) {
    console.error("[api/resources]", error);
    return NextResponse.json(
      { ok: false, message: "Delivery failed. Please try again." },
      { status: 500 }
    );
  }
}
