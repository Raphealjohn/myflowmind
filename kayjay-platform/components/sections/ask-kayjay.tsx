"use client";

import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const OPENER: ChatMessage = {
  role: "assistant",
  content:
    "Hi — I'm Ask Kayjay. I can answer questions about workflow automation, real estate, notarization, or security consulting, and connect you with Rapheal if you'd like. What brings you here?",
};

export function AskKayjay() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([OPENER]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, open]);

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const history = [...messages, { role: "user" as const, content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Keep payload bounded: the opener is presentational, drop it.
        body: JSON.stringify({ messages: history.slice(1).slice(-20) }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        const current = reply;
        setMessages([...history, { role: "assistant", content: current }]);
      }
      if (!reply.trim()) throw new Error("empty reply");
    } catch {
      setMessages([
        ...history,
        {
          role: "assistant",
          content:
            "Something went wrong on my end. The contact form at /contact always works — a human replies within one business day.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <section
          aria-label="Ask Kayjay chat"
          className="mb-3 flex h-[28rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-xl"
        >
          <header className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-serif text-base font-semibold">
              Ask Kayjay<span className="text-gold">.</span>
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-muted hover:text-ink"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </header>

          <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" role="log" aria-live="polite">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-ink text-paper dark:bg-paper dark:text-ink"
                    : "bg-line/40"
                }`}
              >
                {message.content || (
                  <span aria-label="Assistant is typing" className="text-muted">
                    …
                  </span>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
            <label htmlFor="ask-kayjay-input" className="sr-only">
              Your message
            </label>
            <input
              id="ask-kayjay-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about any Kayjay service…"
              maxLength={2000}
              className="w-full rounded-full border border-line bg-paper px-4 py-2 text-sm placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="shrink-0 rounded-full bg-gold px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              Send
            </button>
          </form>
          <p className="border-t border-line px-4 py-2 text-[11px] text-muted">
            AI assistant — answers can be imperfect. Details you share are used only to
            respond to your inquiry (<a href="/legal/privacy" className="underline">privacy</a>).
          </p>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="ml-auto flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper shadow-lg transition-transform hover:-translate-y-0.5 dark:bg-paper dark:text-ink"
      >
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-gold" />
        Ask Kayjay
      </button>
    </div>
  );
}
