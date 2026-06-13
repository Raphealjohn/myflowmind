# Kalevant Group — Business Opportunity Pipeline

Researched expansion ideas, ranked by fit with existing assets (CRM machinery,
Des Moines presence, the four operating companies) and by revenue-per-founder-
hour. Status legend: ✅ implemented on this branch · 🔜 ready to implement ·
🧭 needs validation first.

## Tier 1 — implemented now (compound what exists)

### 1. ✅ Productized service packages on every microsite
**Idea:** Replace "contact us for pricing" with fixed-scope, fixed-price
packages (3 per company, 12 total — see `lib/content.ts`).
**Why lucrative:** Productized pricing removes the discovery-call bottleneck —
the single biggest constraint on a solo founder. Visitors self-qualify against
a number; recurring tiers (Automation Club $197/mo, Remote Investor Concierge
$499/mo, Business Notary Plan $99/mo, Access Review Autopilot $350/mo) build
the MRR base that makes the $1M goal a math problem instead of a hunt.
**Revenue math:** 20 recurring clients across the four plans ≈ $5.6k MRR ≈
$67k/yr before any one-time engagements.

### 2. ✅ "Ask Kalevant" AI concierge as a 24/7 sales rep
**Idea:** Site chatbot grounded in real service data that qualifies leads and
writes them into the CRM with a summary (implemented: `/api/chat` + widget).
**Why lucrative:** After-hours visitors currently bounce; the bot converts
them into pipeline while the founder sleeps. Every captured chat lead arrives
pre-qualified with a need summary, cutting first-call time.

### 3. ✅ Operations automation (digest + nurture)
**Idea:** Weekly auto-digest and nurture sequences replace manual pipeline
review (implemented: `/api/cron/weekly-digest`, `/api/cron/nurture`).
**Why lucrative:** Indirect but real — founder hours returned to billable work.

## Tier 2 — ready to implement next (🔜)

### 4. 🔜 "SMB Back Office" cross-company bundle
**Idea:** One subscription combining the recurring tier of all four companies
for small Des Moines businesses: automation maintenance + quarterly access
review + on-call notary + annual property/lease review. ~$599/mo, anchored
~20% below the sum of parts.
**Why lucrative:** The bundle is the holding company's structural advantage —
no single-service competitor can copy it. Quadruples revenue per account and
makes churn structurally harder (four switching costs, not one).
**Implementation:** New `Company`-level bundle entry or dedicated landing page;
one HubSpot pipeline ("Bundle"); founder delivers from existing playbooks.

### 5. 🔜 Digital products / templates storefront expansion
**Idea:** Extend the existing MyFlowMind Gumroad catalog pattern to the other
three companies: notary prep kits for title companies, landlord document
packs (Iowa-specific), security policy template library (the SMB policy set
insurers ask for).
**Why lucrative:** Zero-marginal-cost revenue from work already done for
clients; the Resource Vault already captures the audience. Iowa-specific legal
and landlord packs have thin competition versus generic national templates.
**Implementation:** Reuse the gated-resource flow with paid checkout (Gumroad
or Stripe Payment Links — no new infrastructure needed).

### 6. 🔜 Notary → loan-signing B2B accounts
**Idea:** Stop selling sessions to consumers one at a time; sell the Business
Notary Plan ($99/mo, implemented) to title companies, law firms, and senior-
care facilities that need a notary monthly.
**Why lucrative:** B2B accounts are 10–20× consumer LTV with the same
fulfillment. The review-request automation already builds the public proof
these buyers check.
**Implementation:** Outbound list of Des Moines title/law offices; the
contact router and pipeline already support it.

## Tier 3 — validate before building (🧭)

### 7. 🧭 White-label "CRM-in-a-box" for local service businesses
**Idea:** The exact lead-capture → scoring → nurture → dashboard machinery in
this repo, deployed for other Des Moines service businesses at $2.5k setup +
$250/mo hosted.
**Why lucrative:** The platform is already built and provider-agnostic
(`lib/crm`); each deployment is configuration, not engineering. It also feeds
MyFlowMind's automation pipeline.
**Validate:** 3 paying pilots from the existing MyFlowMind client base before
productizing.

### 8. 🧭 Mid-term rental arm under Kalevant Realty
**Idea:** Furnished 1–6 month rentals targeting traveling nurses (Des Moines
has three major hospital systems) and insurance-relocation placements, managed
on properties Kalevant acquires or co-manages.
**Why lucrative:** Mid-term rents typically run 1.5–2× unfurnished long-term
rent with lower turnover than short-term; insurance placements pay premium
rates. Synergy: notary handles leases, security handles smart-lock/access
hygiene, MyFlowMind automates guest ops.
**Validate:** Occupancy/rate data on 2 pilot units before scaling; confirm
local ordinance posture on furnished rentals.

### 9. 🧭 RON-as-a-benefit for HR departments
**Idea:** Sell remote-online-notarization access as an employee benefit /
vendor service to mid-size Iowa employers (I-9s, benefits forms, relocations).
**Validate:** 5 discovery conversations with HR managers; check volume before
pricing as subscription vs. per-use.

## Decision rule

An idea graduates from 🧭 to 🔜 only with: (a) 3+ real buyer conversations,
(b) a fulfillment plan that fits founder capacity or contracts out, and
(c) ≥ $20k annual revenue potential. Implementation always lands as a product
entry + pipeline wiring in this repo (see the `product-launcher` agent), so
every new bet inherits the capture/score/nurture machinery on day one.
