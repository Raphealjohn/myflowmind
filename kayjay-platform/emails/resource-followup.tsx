import { EmailShell, P } from "./components";

/** Resource downloaded, no reply in 7 days → implementation offer. */
export default function ResourceFollowup({
  firstName,
  resourceTitle,
  unsubscribeUrl,
}: {
  firstName?: string;
  resourceTitle: string;
  unsubscribeUrl: string;
}) {
  return (
    <EmailShell
      preview={`Putting "${resourceTitle}" into practice`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <P>Hi {firstName ?? "there"},</P>
      <P>
        A week ago you downloaded <strong>{resourceTitle}</strong>. Checklists are
        easy to download and hard to finish — most stall on the two or three steps
        that need someone who&apos;s done it before.
      </P>
      <P>
        If you&apos;d like help implementing it, reply to this email with where you got
        stuck. I&apos;ll point you in the right direction whether or not we end up
        working together.
      </P>
      <P>— Rapheal John, Founder, Kayjay Holding</P>
    </EmailShell>
  );
}
