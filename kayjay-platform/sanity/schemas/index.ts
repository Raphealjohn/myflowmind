/**
 * Sanity schema definitions for the Kayjay Studio.
 * Written as plain schema objects so this package doesn't depend on the
 * `sanity` studio toolkit — drop the array into a studio's schema config:
 *
 *   import { schemaTypes } from "../kayjay-platform/sanity/schemas";
 *   export default defineConfig({ ..., schema: { types: schemaTypes } });
 */

const SUBSIDIARY_OPTIONS = {
  list: [
    { title: "MyFlowMind", value: "myflowmind" },
    { title: "Kayjay Realty", value: "realty" },
    { title: "Kayjay Notary", value: "notary" },
    { title: "Kayjay Security", value: "security" },
    { title: "General / Parent", value: "general" },
  ],
};

const company = {
  name: "company",
  title: "Company",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (r: { required: () => unknown }) => r.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    { name: "tagline", title: "Tagline", type: "string" },
    { name: "summary", title: "Summary", type: "text", rows: 3 },
    { name: "positioning", title: "Positioning paragraph", type: "text", rows: 5 },
    { name: "accentHex", title: "Accent color (hex)", type: "string" },
    { name: "ctaLabel", title: "CTA label", type: "string" },
    { name: "externalUrl", title: "External site URL", type: "url" },
    { name: "logo", title: "Logo", type: "image" },
    {
      name: "services",
      title: "Services",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Short description", type: "text", rows: 2 },
            { name: "detail", title: "Detail (modal)", type: "text", rows: 4 },
          ],
        },
      ],
    },
    {
      name: "products",
      title: "Packaged Products",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string" },
            { name: "price", title: "Price (e.g. $497)", type: "string" },
            {
              name: "cadence",
              title: "Cadence",
              type: "string",
              options: { list: ["one-time", "monthly", "per-visit"] },
            },
            { name: "pitch", title: "Pitch", type: "text", rows: 3 },
            {
              name: "includes",
              title: "What's included",
              type: "array",
              of: [{ type: "string" }],
            },
          ],
        },
      ],
    },
    {
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "quote", title: "Quote", type: "text", rows: 3 },
            { name: "author", title: "Author", type: "string" },
            { name: "role", title: "Role / context", type: "string" },
          ],
        },
      ],
    },
    {
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string" },
            { name: "answer", title: "Answer", type: "text", rows: 4 },
          ],
        },
      ],
    },
  ],
};

const article = {
  name: "article",
  title: "Insight Article",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "excerpt", title: "Excerpt", type: "text", rows: 3 },
    {
      name: "subsidiary",
      title: "Company",
      type: "string",
      options: SUBSIDIARY_OPTIONS,
    },
    { name: "publishedAt", title: "Published", type: "date" },
    {
      name: "body",
      title: "Body paragraphs",
      type: "array",
      of: [{ type: "text" }],
    },
  ],
};

const tickerMetric = {
  name: "tickerMetric",
  title: "Portfolio Ticker Metric",
  type: "document",
  fields: [
    { name: "value", title: "Value (e.g. 12)", type: "string" },
    {
      name: "label",
      title: "Label (e.g. automation workflows deployed this month)",
      type: "string",
    },
    { name: "orderRank", title: "Order", type: "number" },
  ],
};

const revenueEntry = {
  name: "revenueEntry",
  title: "Monthly Revenue Entry",
  type: "document",
  fields: [
    {
      name: "month",
      title: "Month (YYYY-MM)",
      type: "string",
      description: "e.g. 2026-06",
    },
    {
      name: "subsidiary",
      title: "Company",
      type: "string",
      options: SUBSIDIARY_OPTIONS,
    },
    { name: "amount", title: "Revenue (USD)", type: "number" },
  ],
};

const emailCopy = {
  name: "emailCopy",
  title: "Nurture Email Copy",
  type: "document",
  fields: [
    {
      name: "sequence",
      title: "Sequence",
      type: "string",
      options: {
        list: ["inquiry_followup_3d", "notary_review_24h", "resource_followup_7d"],
      },
    },
    { name: "subject", title: "Subject line", type: "string" },
    { name: "paragraphs", title: "Paragraphs", type: "array", of: [{ type: "text" }] },
  ],
};

export const schemaTypes = [company, article, tickerMetric, revenueEntry, emailCopy];
