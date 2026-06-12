import { Link } from "@react-email/components";
import { EmailShell, P } from "./components";

/** Notary job completed → review request 24h later. */
export default function ReviewRequest({
  firstName,
  reviewUrl,
  unsubscribeUrl,
}: {
  firstName?: string;
  reviewUrl: string;
  unsubscribeUrl: string;
}) {
  return (
    <EmailShell
      preview="Thanks for choosing Kayjay Notary — one quick favor"
      unsubscribeUrl={unsubscribeUrl}
    >
      <P>Hi {firstName ?? "there"},</P>
      <P>
        Thanks for trusting Kayjay Notary with your documents. If everything went
        smoothly, a short Google review helps other people in the Des Moines area
        find us — it takes about a minute.
      </P>
      <P>
        <Link href={reviewUrl} style={{ color: "#1B3A6B", fontWeight: 600 }}>
          Leave a review →
        </Link>
      </P>
      <P>
        And if anything was less than perfect, just reply to this email — I read
        every response personally.
      </P>
      <P>— Rapheal John</P>
    </EmailShell>
  );
}
