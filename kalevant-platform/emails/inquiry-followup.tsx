import { EmailShell, P } from "./components";

/** MyFlowMind inquiry, no call booked within 3 days → case-study nudge. */
export default function InquiryFollowup({
  firstName,
  unsubscribeUrl,
}: {
  firstName?: string;
  unsubscribeUrl: string;
}) {
  return (
    <EmailShell
      preview="How a 12-person firm cut nine hours of weekly admin"
      unsubscribeUrl={unsubscribeUrl}
    >
      <P>Hi {firstName ?? "there"},</P>
      <P>
        You reached out about workflow automation but we haven&apos;t found a time to
        talk yet — so here&apos;s the short version of what an engagement looks like.
      </P>
      <P>
        A 12-person services firm came to us losing most of a workday each week to
        manual lead routing and invoice chasing. After a one-week automation audit
        and two workflow builds, they cut nine hours of weekly admin — and they own
        the automations outright.
      </P>
      <P>
        If that sounds like your situation, grab fifteen minutes on my calendar and
        I&apos;ll tell you whether automation is worth it for your workflows — honestly,
        including when it isn&apos;t.
      </P>
      <P>— Rapheal John, Founder, Kalevant Group</P>
    </EmailShell>
  );
}
