import { sanityFetch, sanityConfigured } from "@/lib/sanity";

export interface RevenueEntry {
  /** ISO month, e.g. "2026-05" */
  month: string;
  subsidiary: string;
  amount: number;
}

export const ANNUAL_GOAL = 1_000_000;

/** Manual monthly revenue entries, maintained in Sanity by the founder. */
export async function getRevenueEntries(year: number): Promise<RevenueEntry[]> {
  if (!sanityConfigured()) return [];
  try {
    return await sanityFetch<RevenueEntry[]>(
      `*[_type == "revenueEntry" && month match $year] { month, subsidiary, amount }`,
      { year: `${year}*` }
    );
  } catch {
    return [];
  }
}

export interface PaceReport {
  yearToDate: number;
  goal: number;
  /** Revenue needed per remaining month to hit the goal. */
  requiredMonthly: number;
  /** Positive = ahead of straight-line pace, negative = behind. */
  paceDelta: number;
  onPace: boolean;
  monthsElapsed: number;
}

export function computePace(entries: RevenueEntry[], now = new Date()): PaceReport {
  const yearToDate = entries.reduce((sum, e) => sum + e.amount, 0);
  const monthsElapsed = now.getMonth() + 1;
  const monthsRemaining = 12 - monthsElapsed;
  const straightLineTarget = (ANNUAL_GOAL / 12) * monthsElapsed;
  const paceDelta = yearToDate - straightLineTarget;
  return {
    yearToDate,
    goal: ANNUAL_GOAL,
    requiredMonthly:
      monthsRemaining > 0
        ? Math.max(0, (ANNUAL_GOAL - yearToDate) / monthsRemaining)
        : Math.max(0, ANNUAL_GOAL - yearToDate),
    paceDelta,
    onPace: paceDelta >= 0,
    monthsElapsed,
  };
}
