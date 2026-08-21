"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { MessageCircle, Send, X } from "lucide-react";
import {
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
} from "@/shared/lib/gsap";
import { useChatbot } from "../hooks/useChatbot";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { messages, isSending, error, send } = useChatbot();

  useGSAP(
    () => {
      registerGsap();
      const panel = panelRef.current;
      if (!panel || !open) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.set(panel, { opacity: 1, scale: 1, y: 0 });
      });

      mm.add(NO_REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(
          panel,
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: ease.entrance },
        );
      });

      return () => mm.revert();
    },
    { dependencies: [open] },
  );

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, isSending, open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput("");
  };

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-[76px] md:bottom-8 md:right-[92px] z-40 flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-violet text-wire shadow-[0_10px_28px_-12px_var(--color-violet)] transition-transform hover:-translate-y-0.5 active:scale-95"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-[92px] right-5 md:bottom-[108px] md:right-8 z-40 flex h-[65vh] max-h-[520px] w-[calc(100vw-40px)] max-w-[360px] flex-col overflow-hidden rounded-[8px] border border-border-glow bg-bg-alt shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-border-glow-soft px-4 py-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chip text-text-primary">
              <MessageCircle size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-body text-[14px] font-medium text-text-primary">Narihito's Assistant</span>
              <span className="font-mono text-[10px] tracking-[1px] text-text-muted">ASK ABOUT SKILLS, WORK, PROJECTS</span>
            </div>
          </div>

          <div
            ref={listRef}
            data-lenis-prevent
            className="no-scrollbar flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
          >
            {messages.map((m, i) => {
              const isPendingReply = isSending && i === messages.length - 1 && m.role === "assistant" && m.content === "";
              return (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {isPendingReply ? (
                    <div className="flex items-center gap-1.5 rounded-[6px] bg-chip px-3.5 py-2.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted" />
                    </div>
                  ) : (
                    <p
                      className={`max-w-[85%] rounded-[6px] px-3.5 py-2.5 font-body text-[13px] leading-[1.55] whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-violet text-wire"
                          : "bg-chip text-text-primary"
                      }`}
                    >
                      {m.content}
                    </p>
                  )}
                </div>
              );
            })}

            {error && (
              <span className="font-mono text-[11px] text-text-muted">
                Something went wrong. Try sending that again.
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border-glow-soft p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-[4px] border border-border-glow-soft bg-surface px-3 py-2 font-body text-[13px] text-text-primary outline-none placeholder:text-text-muted focus:border-violet"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-violet text-wire transition-opacity disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
