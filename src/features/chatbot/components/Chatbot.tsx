"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Bot, Check, Copy, Mic, Send, Square, ThumbsDown, ThumbsUp, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ease,
  gsap,
  registerGsap,
  REDUCED_MOTION_QUERY,
  NO_REDUCED_MOTION_QUERY,
} from "@/shared/lib/gsap";
import { chatbotApi } from "../api/chatbotApi";
import { useChatbot } from "../hooks/useChatbot";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { useTypewriterInput } from "../hooks/useTypewriterInput";
import type { ChatFeedbackType, NavDirective } from "../types/types";

function SuggestionChips({ suggestions, onPick }: { suggestions: string[]; onPick: (text: string) => void }) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-2">
      {suggestions.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onPick(question)}
          className="rounded-full border border-border-glow-soft bg-surface px-3 py-1.5 font-mono text-[11px] text-text-secondary transition-colors hover:border-violet hover:text-violet active:scale-95"
        >
          {question}
        </button>
      ))}
    </div>
  );
}

function ChatMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
        ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        a: ({ children, href }) => {
          const isInternal = (href?.startsWith("/") && !href.startsWith("//")) || href?.startsWith("#");
          if (isInternal) {
            return (
              <Link href={href!} className="text-violet underline underline-offset-2">
                {children}
              </Link>
            );
          }
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-violet underline underline-offset-2">
              {children}
            </a>
          );
        },
        code: ({ children }) => (
          <code className="rounded bg-surface px-1 py-0.5 font-mono text-[12px]">{children}</code>
        ),
        table: ({ children }) => (
          <div className="themed-scrollbar mb-2 overflow-x-auto last:mb-0">
            <table className="w-full border-collapse text-[12px]">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="border-b border-border-glow-soft">{children}</thead>,
        th: ({ children }) => <th className="px-2 py-1 text-left font-medium text-text-primary">{children}</th>,
        td: ({ children }) => <td className="border-t border-border-glow-soft px-2 py-1 align-top">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function NavPill({ nav, onGo }: { nav: NavDirective; onGo: (path: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onGo(nav.path)}
      className="mt-1.5 flex w-fit items-center gap-1.5 rounded-full border border-border-glow-soft bg-surface px-3 py-1.5 font-mono text-[11px] text-text-secondary transition-colors hover:border-violet hover:text-violet active:scale-95"
    >
      {nav.label}
      <ArrowRight size={12} />
    </button>
  );
}

function MessageActions({
  messageId,
  content,
  userMessage,
  feedback,
  onFeedback,
}: {
  messageId: string;
  content: string;
  userMessage?: string;
  feedback: ChatFeedbackType | null;
  onFeedback: (messageId: string, type: ChatFeedbackType) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFeedback = (type: ChatFeedbackType) => {
    if (feedback === type) return;
    onFeedback(messageId, type);
    chatbotApi.sendFeedback(messageId, content, type, userMessage).catch(() => {});
  };

  return (
    <div className="flex items-center gap-1 pt-1">
      <button
        type="button"
        aria-label="Copy message"
        onClick={handleCopy}
        className="flex h-6 w-6 items-center justify-center rounded text-text-muted transition-colors hover:text-text-primary"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
      <button
        type="button"
        aria-label="Like message"
        onClick={() => handleFeedback("like")}
        className={`flex h-6 w-6 items-center justify-center rounded text-text-muted transition-colors hover:text-text-primary ${
          feedback === "like" ? "animate-feedback-pop text-violet" : ""
        }`}
      >
        <ThumbsUp size={13} fill={feedback === "like" ? "currentColor" : "none"} />
      </button>
      <button
        type="button"
        aria-label="Dislike message"
        onClick={() => handleFeedback("dislike")}
        className={`flex h-6 w-6 items-center justify-center rounded text-text-muted transition-colors hover:text-text-primary ${
          feedback === "dislike" ? "animate-feedback-pop text-violet" : ""
        }`}
      >
        <ThumbsDown size={13} fill={feedback === "dislike" ? "currentColor" : "none"} />
      </button>
    </div>
  );
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const { input, ghost, ghostVisible, setFromUser: setInput, setFont, appendTyped, getFullText } = useTypewriterInput();
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, isSending, error, send, goTo } = useChatbot();
  const [feedbackByMessage, setFeedbackByMessage] = useState<Record<string, ChatFeedbackType>>({});

  const handleFeedback = (messageId: string, type: ChatFeedbackType) => {
    setFeedbackByMessage((prev) => ({ ...prev, [messageId]: type }));
  };

  const sendVoiceInput = useCallback(() => {
    const text = getFullText().trim();
    if (!text) return;
    send(text);
    setInput("");
  }, [getFullText, send, setInput]);

  const { recording, transcribing, error: voiceError, toggle: toggleVoice } = useVoiceInput(appendTyped, sendVoiceInput);

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

  useEffect(() => {
    if (!open || !inputRef.current) return;
    const style = getComputedStyle(inputRef.current);
    setFont(`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`);
  }, [open, setFont]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput("");
  };

  const handleClose = () => {
    const panel = panelRef.current;
    if (!panel) { setOpen(false); return; }

    const mm = gsap.matchMedia();
    mm.add(REDUCED_MOTION_QUERY, () => { setOpen(false); });

    mm.add(NO_REDUCED_MOTION_QUERY, () => {
      gsap.to(panel, {
        opacity: 0,
        scale: 0.85,
        y: 30,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => setOpen(false),
      });
    });

    setTimeout(() => mm.revert(), 500);
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-40 flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-violet text-wire shadow-[0_10px_28px_-12px_var(--color-violet)] transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          <Bot size={20} />
        </button>
      )}

      {open && (
        <div className="pointer-events-none fixed bottom-6 md:bottom-8 inset-x-0 z-40 flex justify-end px-5 md:pr-8">
        <div
          ref={panelRef}
          className="pointer-events-auto flex h-[65vh] max-h-[520px] w-full max-w-[360px] flex-col overflow-hidden rounded-[8px] border border-border-glow bg-bg-alt shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-border-glow-soft px-4 py-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chip text-text-primary">
              <Bot size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-body text-[14px] font-medium text-text-primary">Narihito Assistant</span>
              <span className="font-body text-[12px] tracking-[1px] text-text-muted">Ask about skills, works or projects</span>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={handleClose}
              className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:text-text-primary"
            >
              <X size={16} />
            </button>
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
                  key={m.id}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  {isPendingReply ? (
                    <div className="flex items-center gap-1.5 rounded-[6px] bg-chip px-3.5 py-2.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted" />
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] rounded-[6px] px-3.5 py-2.5 font-body text-[13px] leading-[1.55] ${
                        m.role === "user"
                          ? "bg-violet text-wire whitespace-pre-wrap"
                          : "bg-chip text-text-primary"
                      }`}
                    >
                      {m.role === "assistant" ? <ChatMarkdown content={m.content} /> : m.content}
                    </div>
                  )}
                  {m.role === "assistant" && !isPendingReply && m.content && m.nav && (
                    <NavPill nav={m.nav} onGo={goTo} />
                  )}
                  {m.role === "assistant" && !isPendingReply && m.content && (
                    <MessageActions
                      messageId={m.id}
                      content={m.content}
                      userMessage={[...messages].slice(0, i).reverse().find((x) => x.role === "user")?.content}
                      feedback={feedbackByMessage[m.id] ?? null}
                      onFeedback={handleFeedback}
                    />
                  )}
                  {m.role === "assistant" && !isSending && i === messages.length - 1 && !!m.suggestions?.length && (
                    <SuggestionChips suggestions={m.suggestions} onPick={send} />
                  )}
                </div>
              );
            })}

            {error && (
              <span className="font-mono text-[11px] text-text-muted">
                Something went wrong. Try sending that again.
              </span>
            )}

            {voiceError && (
              <span className="font-mono text-[11px] text-text-muted">{voiceError}</span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border-glow-soft p-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={recording ? "Listening..." : "Ask a question..."}
                className={`w-full rounded-[4px] border bg-surface px-3 py-2 font-body text-[13px] text-text-primary outline-none placeholder:text-text-muted transition-colors duration-300 ${
                  recording ? "border-violet animate-pulse" : "border-border-glow-soft focus:border-violet"
                }`}
              />
              {ghost && (
                <span
                  aria-hidden
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-pre font-body text-[13px] italic text-text-muted transition-all duration-200 ${
                    ghostVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                  }`}
                  style={{ left: 12 + ghost.left }}
                >
                  {ghost.text}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={toggleVoice}
              disabled={transcribing && !recording}
              aria-label={recording ? "Stop voice input" : "Start voice input"}
              aria-pressed={recording}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border transition-colors disabled:opacity-40 ${
                recording
                  ? "border-violet bg-violet/10 text-violet animate-pulse"
                  : "border-border-glow-soft text-text-secondary hover:border-violet hover:text-violet"
              }`}
            >
              {recording ? <Square size={13} /> : <Mic size={15} />}
            </button>
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
        </div>
      )}
    </>
  );
}
