import { Link } from "@react-email/components";
import { EmailShell, P } from "./components";

/** Immediate delivery email for a gated resource download. */
export default function ResourceDelivery({
  firstName,
  resourceTitle,
  downloadUrl,
  unsubscribeUrl,
}: {
  firstName?: string;
  resourceTitle: string;
  downloadUrl: string;
  unsubscribeUrl: string;
}) {
  return (
    <EmailShell
      preview={`Your download: ${resourceTitle}`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <P>Hi {firstName ?? "there"},</P>
      <P>
        Here&apos;s your copy of <strong>{resourceTitle}</strong>:
      </P>
      <P>
        <Link href={downloadUrl} style={{ color: "#C9A227", fontWeight: 600 }}>
          Download {resourceTitle} →
        </Link>
      </P>
      <P>
        Questions while working through it? Reply to this email — it goes straight
        to me.
      </P>
      <P>— Rapheal John, Founder, Kalevant Group</P>
    </EmailShell>
  );
}
