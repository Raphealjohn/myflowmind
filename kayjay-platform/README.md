# Kayjay Holding Platform (v2 — CRM Edition)

Multi-company platform for **Kayjay Holding** (West Des Moines, Iowa): a parent
brand site, four subsidiary microsites, and a CRM-managed lead pipeline — every
form on the site captures, scores, and routes visitors into HubSpot.

**Companies:** MyFlowMind · Kayjay Realty · Kayjay Notary Services · Kayjay
Security Consulting (architecture scales to N subsidiaries — add an entry to
`lib/content.ts` or a `company` document in Sanity).

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript strict |
| Styling | Tailwind CSS + custom token system (`tailwind.config.ts`, `app/globals.css`) |
| Animation | Framer Motion (meridian line, constellation, reveals) |
| CMS | Sanity.io (optional — typed seed content ships in `/lib`) |
| CRM | HubSpot Free via provider-agnostic layer in `/lib/crm` |
| Email | Resend + React Email templates in `/emails` |
| Booking | Cal.com embed + webhook → CRM deals |
| Auth | NextAuth (single founder account) for `/admin` |
| Deploy | Vercel (cron in `vercel.json` drives nurture sequences) |

## Quick start

```bash
cd kayjay-platform
npm install
cp .env.example .env.local   # fill in what you have; everything degrades gracefully
npm run dev
```

With no env vars set, the site runs fully: CRM writes log to the console,
emails log to the console, and content comes from the typed seed data.

## Setup, in order

### 1. HubSpot (the system of record)

1. Create a free HubSpot account → Settings → Integrations → **Private Apps**.
2. Create an app with scopes: `crm.objects.contacts.read/write`,
   `crm.objects.deals.read/write`, `crm.schemas.contacts.write`, and deal
   pipeline read/write.
3. Put the token in `.env.local` as `HUBSPOT_ACCESS_TOKEN`.
4. Run the one-time setup (creates 11 custom contact properties + 4 pipelines
   with the exact stage IDs the code references):

```bash
npm run setup:hubspot
```

Pipelines created: MyFlowMind (Inquiry → Discovery Call → Automation Audit →
Proposal → Won/Lost), Realty (Inquiry → Qualification → Showing → Offer →
Closed), Notary (Request → Scheduled → Completed → Review Requested), Security
(Inquiry → Scoping Call → Assessment → SOW → Engaged).

### 2. Resend (email)

Verify your sending domain at resend.com, create an API key, set
`RESEND_API_KEY`, `EMAIL_FROM`, and `FOUNDER_EMAIL`. Hot-lead alerts
(score ≥ 15) and resource deliveries send immediately; nurture sequences send
via the daily cron.

### 3. Cal.com (booking → deals)

Create event types whose slugs start with the subsidiary key
(`myflowmind-discovery`, `notary-mobile`, `realty-walkthrough`,
`security-scoping`). Add a webhook pointing to
`https://yourdomain.com/api/webhooks/calcom` for `BOOKING_CREATED`, and copy
its secret to `CALCOM_WEBHOOK_SECRET`. Each booking upserts the contact
(+10 score) and creates a deal at the right stage.

### 4. Sanity studio (optional, for non-developer editing)

The site works without Sanity. To make content editable:

1. `npm create sanity@latest` in a sibling folder, choose a clean project.
2. Import the schema types from `kayjay-platform/sanity/schemas`.
3. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`.
4. Seed documents for the four companies, ticker metrics, articles, and
   monthly `revenueEntry` documents (these power the $1M pace tracker).

### 5. Founder dashboard

Set `NEXTAUTH_SECRET` (`openssl rand -base64 32`), `NEXTAUTH_URL`,
`ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Then `/admin` shows pipeline value per
subsidiary, leads this week vs last, hot leads with one-click email, and
revenue pace against the $1M annual goal.

### 6. "Ask Kayjay" assistant (Anthropic API)

Set `ANTHROPIC_API_KEY` to enable the site chatbot. It answers service
questions from the same typed content that renders the pages
(`lib/chat.ts` builds the grounding from `lib/content.ts`), qualifies leads
conversationally, and — only after the visitor shares an email and agrees to
be contacted — calls a `capture_lead` tool that writes the contact + deal into
the CRM with a need summary and alerts the founder. Without the key, the
widget degrades to a pointer at `/contact`.

### 7. Deploy (Vercel)

1. Import the repo in Vercel, set **Root Directory** to `kayjay-platform`.
2. Add every variable from `.env.example`.
3. `vercel.json` registers two crons: daily nurture (`/api/cron/nurture`,
   14:00 UTC) and the Monday ops digest (`/api/cron/weekly-digest`, 13:00 UTC).
   Set `CRON_SECRET` so only Vercel can invoke them.

## How the CRM layer works

```
form/webhook → captureLead() → scoreLead() → CrmProvider.upsertContact()
                                   │
                       score ≥ 15 → hot-lead alert email to founder
contact router intent ───────────→ CrmProvider.createDeal() (subsidiary pipeline)
daily cron ──→ getNurtureCandidates() → React Email via Resend → markNurtureSent()
```

`lib/crm/index.ts` resolves the active provider. To swap HubSpot for Twenty or
Attio later, implement `CrmProvider` (`lib/crm/types.ts`) and change one line —
no UI or route changes.

**Scoring:** +10 booked call · +5 gated download · +3 newsletter · +2 return
visit (first-party cookie) · +5 company email domain.

**Nurture sequences** (deduped per-contact via the `nurture_sequences_sent`
property, consent-gated, one-click unsubscribe):

- MyFlowMind inquiry with no call after 3 days → case-study email
- Notary completed → Google review request after 24h
- Resource download with no reply after 7 days → implementation offer

## Content guide (non-developers)

- **Company pages, FAQ, testimonials** — edit the `company` documents in Sanity
  (or `lib/content.ts` until Sanity is connected).
- **Portfolio ticker** — `tickerMetric` documents; refresh monthly so numbers
  never look stale.
- **Articles** — `article` documents, tagged by company.
- **Revenue tracker** — add one `revenueEntry` per company per month.
- **Gated downloads** — drop the real PDFs over the placeholders in
  `public/resources/` (keep the filenames in `lib/resources.ts`).

## Operating the business with agents

`.claude/agents/` (repo root) defines Claude Code agents for running the
platform day-to-day — invoke them from any Claude Code session on this repo:

- **site-content-manager** — add/update products, services, FAQs, articles,
  ticker metrics; knows where every piece of content lives and verifies the
  build.
- **product-launcher** — designs and ships a new offer end-to-end: pricing
  ladder, content entry, funnel wiring (intent → pipeline), supporting
  resource/article, build verification.
- **ops-analyst** — audits scoring weights, nurture timing, pipeline stages,
  and SLAs against `docs/OPERATIONS.md` and proposes ranked optimizations.

Supporting docs: `docs/OPERATIONS.md` (the ops playbook: SLAs, weekly/monthly
rhythm, KPIs) and `docs/BUSINESS-IDEAS.md` (ranked expansion pipeline with
revenue math and validation gates).

## Compliance

Every capture point has an explicit consent checkbox stored in the CRM
(`marketing_consent`); nurture emails only go to consented contacts and every
one carries a one-click unsubscribe (`/api/unsubscribe`) that takes effect
immediately. `/legal/privacy` documents the actual data flows.
