import "server-only";

import { Resend } from "resend";
import type { ReactElement } from "react";

let resend: Resend | null = null;

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function getResend(): Resend {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export const FROM_ADDRESS =
  process.env.EMAIL_FROM ?? "Kalevant Group <hello@kalevant.com>";

export const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL ?? "raphealjohn77@gmail.com";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  react: ReactElement;
}): Promise<void> {
  if (!emailConfigured()) {
    console.info("[email:console]", opts.to, opts.subject);
    return;
  }
  const { error } = await getResend().emails.send({
    from: FROM_ADDRESS,
    to: opts.to,
    subject: opts.subject,
    react: opts.react,
  });
  if (error) throw new Error(`Resend send failed: ${error.message}`);
}
