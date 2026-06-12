import type { Config } from "tailwindcss";

/**
 * Design tokens — "Modern institutional".
 * Every color routes through a CSS custom property so subsidiary pages can
 * re-theme the accent layer (data-subsidiary attribute) without new classes.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Fluid editorial scale
        "display-xl": [
          "clamp(2.75rem, 1.5rem + 5.5vw, 6.5rem)",
          { lineHeight: "1.02", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2.25rem, 1.25rem + 3.5vw, 4.25rem)",
          { lineHeight: "1.06", letterSpacing: "-0.018em" },
        ],
        "display-md": [
          "clamp(1.75rem, 1.1rem + 2.2vw, 3rem)",
          { lineHeight: "1.1", letterSpacing: "-0.015em" },
        ],
        eyebrow: [
          "0.8125rem",
          { lineHeight: "1.4", letterSpacing: "0.14em" },
        ],
      },
      maxWidth: {
        measure: "68ch",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
