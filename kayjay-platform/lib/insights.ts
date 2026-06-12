import { sanityFetch, sanityConfigured } from "@/lib/sanity";
import type { Subsidiary } from "@/lib/crm/types";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  subsidiary: Subsidiary;
  publishedAt: string;
  body: string[];
}

/** Seed articles; replaced by Sanity documents once the studio is connected. */
const SEED_ARTICLES: Article[] = [
  {
    slug: "five-workflows-every-smb-should-automate-first",
    title: "The five workflows every small business should automate first",
    excerpt:
      "Not all automation is equal. These five workflows pay back fastest — and three of them take under a week to ship.",
    subsidiary: "myflowmind",
    publishedAt: "2026-05-12",
    body: [
      "When we audit a small business, the same five workflows show up at the top of the hours-lost list almost every time: lead follow-up, invoice chasing, appointment scheduling, data re-entry between tools, and report assembly.",
      "Start with lead follow-up. It has the clearest revenue link — a lead contacted within five minutes is dramatically more likely to convert than one contacted the next morning — and it's usually a two-tool integration, not a re-platforming project.",
      "Invoice chasing comes second because the money is already earned; you're just not collecting it on time. A three-step reminder sequence recovers most late invoices without a single awkward phone call.",
      "The rule across all five: automate the workflow you already do consistently by hand. Automation amplifies a process — including a broken one.",
    ],
  },
  {
    slug: "what-remote-online-notarization-actually-requires",
    title: "What remote online notarization actually requires in Iowa",
    excerpt:
      "RON is fully legal in Iowa — but the identity-verification steps surprise most first-timers. Here's the checklist.",
    subsidiary: "notary",
    publishedAt: "2026-04-28",
    body: [
      "Iowa authorized remote online notarization in 2020, and documents notarized this way are recognized across state lines. The session happens over recorded video with a commissioned Iowa notary.",
      "Identity verification is the step that trips people up. Expect knowledge-based authentication — five questions drawn from public records that you must answer quickly — plus a credential analysis scan of your government ID.",
      "Have the unsigned document ready as a PDF, a device with a camera and microphone, and your physical ID. The notarization itself usually takes under fifteen minutes once verification passes.",
    ],
  },
  {
    slug: "shared-passwords-are-a-resignation-letter-away",
    title: "Your shared passwords are one resignation letter away from a breach",
    excerpt:
      "The most common SMB security gap isn't malware — it's the spreadsheet of shared logins nobody rotates when someone leaves.",
    subsidiary: "security",
    publishedAt: "2026-04-02",
    body: [
      "Ask a 20-person company how a departing employee loses access, and the honest answer is usually 'eventually.' Shared credentials in a spreadsheet or password manager group mean offboarding depends on memory, not process.",
      "The fix is less expensive than most owners assume: single sign-on through the identity provider you likely already pay for (Microsoft 365 or Google Workspace), MFA enforced by policy, and a joiner/mover/leaver checklist that IT — or whoever plays IT — runs on day one and day last.",
      "Cyber insurers have noticed. The renewal questionnaires now ask specifically about MFA coverage and access reviews, and answers affect premiums. A 30-day identity baseline often pays for itself at renewal.",
    ],
  },
  {
    slug: "reading-a-des-moines-walkthrough-report",
    title: "How to read a property walkthrough report like an investor",
    excerpt:
      "A walkthrough report is only useful if you know which findings kill a deal and which are negotiation leverage.",
    subsidiary: "realty",
    publishedAt: "2026-03-15",
    body: [
      "Walkthrough findings sort into three buckets: deal-killers (foundation movement, active water intrusion, knob-and-tube wiring), negotiation items (roof age, HVAC nearing end of life), and noise (cosmetic wear that scares first-timers and means nothing).",
      "The mistake new investors make is pricing the noise and ignoring the middle bucket. A 22-year-old roof isn't a reason to walk — it's a documented, dated expense you subtract from your offer with the contractor bid attached.",
      "In the Des Moines metro specifically, pay attention to basement water management. Our freeze-thaw cycles make grading and gutter findings more predictive of future cost than almost anything else on the report.",
    ],
  },
];

export async function getArticles(): Promise<Article[]> {
  if (sanityConfigured()) {
    try {
      const articles = await sanityFetch<Article[]>(
        `*[_type == "article"] | order(publishedAt desc) {
          "slug": slug.current, title, excerpt, subsidiary, publishedAt, body
        }`
      );
      if (articles && articles.length > 0) return articles;
    } catch {
      // fall through to seed content
    }
  }
  return SEED_ARTICLES;
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug);
}
