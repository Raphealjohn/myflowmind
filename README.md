# myflowmind.com

Static website for **MyFlowMind** — an AI automation agency.

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
