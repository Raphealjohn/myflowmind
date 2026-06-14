import { EmailShell, P } from "./components";
import type { ScoredLead } from "@/lib/crm/types";

export default function HotLeadAlert({ lead }: { lead: ScoredLead }) {
  return (
    <EmailShell preview={`Hot lead: ${lead.email} scored ${lead.score}`}>
      <P>
        <strong>Hot lead captured</strong> — score {lead.score}.
      </P>
      <P>
        {lead.firstName ?? "Unknown"} {lead.lastName ?? ""} · {lead.email}
        {lead.phone ? ` · ${lead.phone}` : ""}
      </P>
      <P>
        Subsidiary: {lead.subsidiary} · Intent: {lead.intent}
      </P>
      <P>Source page: {lead.sourcePage}</P>
      {lead.message ? <P>Message: “{lead.message}”</P> : null}
      <P>Reply within the hour while it&apos;s warm.</P>
    </EmailShell>
  );
}
