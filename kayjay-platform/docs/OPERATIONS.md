# Kayjay Holding — Operations Playbook

One owner, four companies. This playbook makes the platform run the operations
so the founder runs the businesses. It is the reference the `ops-analyst`
agent audits against.

## Operating principles

1. **One system of record.** Every contact, deal, and consent flag lives in
   HubSpot. If it isn't in the CRM, it didn't happen.
2. **Automation first, founder second.** A human touches a lead only after the
   platform has captured, scored, routed, and (where possible) replied.
3. **Fixed-scope products before custom work.** Custom engagements only when a
   packaged product (see each company's `products`) genuinely doesn't fit.
4. **Numbers refresh monthly minimum.** Stale ticker metrics and revenue
   entries undermine the whole transparency positioning.

## Service-level agreements

| Event | SLA | Enforced by |
|---|---|---|
| Hot lead (score ≥ 15) | Founder reply within 1 hour | Instant alert email (`lib/leads.ts`) |
| Any inquiry | Reply within 1 business day | Stated on site; inquiry lands in pipeline at capture |
| MyFlowMind inquiry, no call | Case-study email at day 3 | Nurture cron |
| Notary job completed | Review request at +24h | Nurture cron |
| Resource download, no reply | Implementation offer at day 7 | Nurture cron |
| Booking created (Cal.com) | Deal at correct stage instantly | Webhook (`/api/webhooks/calcom`) |

## Weekly rhythm (≈45 min total founder time)

- **Monday 8:00 CT** — read the automated weekly digest (`/api/cron/weekly-digest`):
  leads vs. last week, pipeline value per company, hot-lead queue. Act on hot
  leads first.
- **Monday** — advance stale deals: anything sitting in the same stage > 14
  days gets a touch or gets closed-lost. (HubSpot view: deals by last-modified.)
- **Friday** — 10-minute pipeline hygiene pass: amounts on every deal so the
  dashboard's pipeline value means something.

## Monthly rhythm

- Add one `revenueEntry` per company in Sanity (powers the $1M pace tracker).
- Refresh the four ticker metrics.
- Review the nurture report (cron logs): sends per sequence, and reply rate
  by spot-checking threads. Kill or rewrite any sequence with zero replies
  two months running.
- Publish at least one insight article (rotating company) — feeds SEO, the
  newsletter, and the chatbot's usefulness.

## Cross-company efficiency levers

- **Shared capture, shared scoring.** All four companies use the same capture →
  score → route machinery; a fix in `lib/crm` improves every funnel at once.
- **Cross-sell at natural seams.** Notary clients closing real estate deals →
  Realty walkthrough offer. Security onboarding clients → MyFlowMind audit
  (access cleanup always surfaces process mess). Add these as manual HubSpot
  tasks on deal close until volume justifies automation.
- **Chatbot as tier-0 support.** Ask Kayjay answers service questions from the
  same content that renders the site — keeping `lib/content.ts` accurate IS
  the support knowledge base.

## KPI definitions

| KPI | Definition | Target |
|---|---|---|
| Lead velocity | New CRM contacts / week | Growing 4-week trend |
| Hot-lead response time | Capture → first founder reply | < 1 hour |
| Capture rate | Form submits / unique visitors | ≥ 2% |
| Pipeline coverage | Open pipeline value / monthly revenue target | ≥ 3× |
| Pace delta | YTD revenue − straight-line $1M pace | ≥ $0 |
| Review rate (Notary) | Google reviews / completed jobs | ≥ 25% |

## Escalation defaults

- CRM write failures log server-side and never block the visitor (forms degrade
  to console provider). Check Vercel logs weekly for `[crm` errors.
- If Resend or HubSpot keys expire, hot-lead alerts silently stop — the weekly
  digest doubles as the canary (no digest Monday = investigate keys).
