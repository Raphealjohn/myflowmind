# myflowmind.com

Static website for **MyFlowMind** — an AI automation studio & digital product storefront.

## Homepage sections (redesigned)

The home page (`index.html`) is a self-contained, conversion-focused single page:

1. **Hero** — kinetic display headline, animated aurora background, glass "Studio" mockup.
2. **Logo marquee** — the tools MyFlowMind builds on.
3. **Stats bar** — animated count-up metrics.
4. **Services (bento grid)** — automation offering with cursor-follow glow.
5. **Content Studio** — a premium creator-dashboard *upload hub*. Drag-and-drop
   promo assets (client-side preview only — no backend yet), compose a campaign
   with live caption preview, and schedule/publish. Wire it to a real backend to
   make uploads persist.
6. **Digital Products** — storefront showcase with live category filtering + search.
   Cards link to the Gumroad store.
7. **Process · Testimonials · Pricing · CTA · Footer.**

> Visual direction: futuristic + fun + premium. Space Grotesk (display) + Plus
> Jakarta Sans (body); violet→cyan→mint gradient spectrum with pink/amber accents;
> restrained glassmorphism on nav/cards/modals per 2026 best practice.

## Legal pages — punch list before treating as final

`privacy.html` and `terms.html` are solid **starter templates, not legal advice**.
They're safe to keep published (a clear policy beats none), but a human/lawyer
should confirm the remaining items before they're considered final.

**Resolved (current setup):**
- Operator: **Rapheal John, sole proprietor, trading as "MyFlowMind"** (Des Moines, Iowa, US)
- Governing law / jurisdiction: **State of Iowa & the United States** (terms §11)
- Contact: **email-only** (`contact@myflowmind.com`) — no physical address published

**Still to confirm / watch:**
- **Mailing address** — email-only is fine today. If you start sending marketing
  emails, US CAN-SPAM requires a valid physical postal address in the email — get a
  cheap PO box / virtual mailbox then and add it.
- **Refund policy** specifics (terms §4) — confirm they match Gumroad/Etsy reality.
- **Cookies/analytics** — if Google Analytics (or similar) is added later, add a
  cookie notice and name the tools. (Google Fonts is loaded today.)
- **AI data-handling** claim ("not used to train third-party models") — privacy §5
- Age requirement (18, terms §2) and liability cap (12 months' fees, terms §9)
- **Future:** consider forming an LLC for personal-liability protection; then swap
  the sole-proprietor line for the entity name + registered address.


## Stack

- Plain HTML5 / CSS3 / vanilla JS (no framework, no build step)
- Hosted on GoDaddy shared hosting
- Deployed via Git push to `Raphealjohn/myflowmind`

## Project Structure

```
myflowmind.com/
├── index.html          ← Home page
├── about.html          ← About page
├── services.html       ← Services & pricing page
├── contact.html        ← Contact / enquiry form
├── 404.html            ← Custom 404 error page
├── .htaccess           ← Apache config: security headers, redirects, caching
├── .env.example        ← Environment variable template
├── .gitignore
├── README.md
├── public/
│   ├── favicon.ico     ← SVG favicon
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── components/
    │   ├── header.html     ← Navigation snippet (reference)
    │   ├── footer.html     ← Footer snippet (reference)
    │   └── seo-head.html   ← SEO <head> template
    └── styles/
        └── global.css      ← All styles
```

> Note: `src/components/` contains reference snippets. All deployable pages are HTML files at the root — GoDaddy serves them directly with no build step required.

## Local Development

Open any `.html` file in your browser directly, or run a local server:

```bash
# Python 3
python3 -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080`.

## Deployment

This site uses `git push` deployment to GoDaddy.

```bash
# Add the GoDaddy remote (one-time setup — requires your GoDaddy SSH credentials)
git remote add godaddy ssh://USER@myflowmind.com/~/public_html

# Push to production
git push godaddy main
```

See the **Manual Steps** section below for full setup instructions.

## Contact Form

The contact form in `contact.html` currently has `action="#"` as a placeholder.  
Before going live, update it to a real form backend:

- **Formspree** (simplest): `action="https://formspree.io/f/YOUR_FORM_ID"`
- **Netlify Forms**: add `netlify` attribute if migrating to Netlify
- **Custom backend**: update `action` to your API endpoint

## Manual Steps Required Before Launch

| Step | Detail |
|------|--------|
| Connect contact form | Update `action` in `contact.html` with your Formspree/backend URL |
| Add GoDaddy Git remote | `git remote add godaddy ssh://USER@myflowmind.com/~/public_html` |
| Push to GoDaddy | `git push godaddy main` (requires SSH key configured in GoDaddy cPanel) |
| Push to GitHub | `git push origin main` (first push to `Raphealjohn/myflowmind`) |
| Submit sitemap | Submit `https://myflowmind.com/sitemap.xml` to Google Search Console |
| Add OG images | Create `/public/og-home.png`, `og-about.png`, `og-services.png`, `og-contact.png` (1200×630px each) |
| Configure analytics | Add GA snippet to each page once `GA_MEASUREMENT_ID` is set |
| Verify SSL | Confirm HTTPS redirect in `.htaccess` works after GoDaddy SSL provisioning |
| Add privacy/terms pages | Stub pages referenced in footer: `privacy.html`, `terms.html` |

## Accessibility

- All pages pass WCAG 2.1 AA contrast requirements (dark theme, white text on dark bg)
- Skip-to-content link on every page
- All interactive elements keyboard-navigable with visible focus rings
- All images include descriptive `alt` text
- Semantic HTML5 landmarks throughout

## Security

Security headers are set via `.htaccess`:
- `Strict-Transport-Security` (HSTS)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera, microphone, geolocation denied)
- `Content-Security-Policy`
