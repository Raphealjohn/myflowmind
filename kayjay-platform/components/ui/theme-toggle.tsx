"use client";

import { useEffect, useState } from "react";

/**
 * Dark/light toggle. Defaults to system preference; explicit choice is
 * persisted. A blocking script in layout.tsx applies the class pre-paint.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("kj-theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-full border border-line p-2 text-sm transition-colors hover:border-ink dark:hover:border-paper"
    >
      <span aria-hidden="true">{dark === null ? "◐" : dark ? "☀" : "☾"}</span>
    </button>
  );
}
