"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Bug, Check, Lightbulb, MessageCircle, Palette, Sparkles, X, type LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { feedbackApi } from "../api/feedbackApi";
import { useSendFeedback } from "../hooks/useSendFeedback";
import type { FeedbackCategory, FeedbackFormData } from "../types/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 2000;
const EMPTY_FORM: FeedbackFormData = { name: "", email: "", category: "SUGGESTION", message: "" };

const CATEGORY_OPTIONS: { value: FeedbackCategory; label: string; icon: LucideIcon }[] = [
  { value: "SUGGESTION", label: "Suggestion", icon: Lightbulb },
  { value: "BUG", label: "Bug", icon: Bug },
  { value: "DESIGN", label: "Design", icon: Palette },
  { value: "OTHER", label: "Other", icon: MessageCircle },
];

const LABEL = "font-mono text-[10px] tracking-[1.5px] text-text-muted";
const FIELD =
  "rounded-[4px] border bg-surface px-3 font-body fs-14 text-text-primary outline-none transition-colors placeholder:text-text-muted";

export function FeedbackForm() {
  const sendMut = useSendFeedback();
  const [form, setForm] = useState<FeedbackFormData>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const formatValid = EMAIL_RE.test(form.email);

  useEffect(() => {
    if (!formatValid) return;

    const id = setTimeout(async () => {
      setVerifying(true);
      const deliverable = await feedbackApi.verifyEmail(form.email).catch(() => false);
      setVerifying(false);
      setEmailInvalid(!deliverable);
      setEmailVerified(deliverable);
    }, 500);

    return () => clearTimeout(id);
  }, [form.email, formatValid]);

  const update = <K extends keyof FeedbackFormData>(key: K, value: FeedbackFormData[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!formatValid || verifying || emailInvalid) return;

    setErrorMsg(null);
    sendMut.mutate(form, {
      onSuccess: () => {
        setSubmitted(true);
        setForm(EMPTY_FORM);
        setEmailInvalid(false);
        setEmailVerified(false);
      },
      onError: (err) => {
        const retryAfter = (err as Error & { retryAfter?: number }).retryAfter;
        setErrorMsg(retryAfter ? `Please wait ${retryAfter}s before sending more feedback.` : err.message);
        setTimeout(() => setErrorMsg(null), 5000);
      },
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-[6px] border border-border-glow-soft bg-surface p-6 md:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chip text-violet">
          <Check size={22} strokeWidth={2} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-display fs-22 font-semibold text-text-primary">Thanks for the feedback.</p>
          <p className="font-body fs-15 leading-[1.6] text-text-secondary">
            I appreciate you taking the time to share your thoughts.
          </p>
        </div>
        <Button variant="secondary" onClick={() => setSubmitted(false)} className="mt-1 !rounded-full !px-5 !py-2.5 !fs-13">
          Send more feedback
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <label htmlFor="feedback-name" className={LABEL}>NAME</label>
          <input
            id="feedback-name"
            type="text"
            required
            maxLength={100}
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            className={`h-11 ${FIELD} border-border-glow-soft focus:border-violet`}
            placeholder="Your name"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <label htmlFor="feedback-email" className={LABEL}>EMAIL</label>
          <input
            id="feedback-email"
            type="email"
            required
            value={form.email}
            onChange={(event) => {
              update("email", event.target.value);
              setEmailInvalid(false);
              setEmailVerified(false);
            }}
            className={`h-11 ${FIELD} ${
              emailInvalid ? "border-red-500 focus:border-red-500" : "border-border-glow-soft focus:border-violet"
            }`}
            placeholder="your@email.com"
          />
          {(verifying || emailInvalid || emailVerified) && (
            <span
              className={`flex items-center gap-1 font-mono text-[10px] ${
                emailInvalid ? "text-red-500" : emailVerified ? "text-green-600 dark:text-green-400" : "text-text-muted"
              }`}
            >
              {emailInvalid && <X size={11} strokeWidth={2.5} />}
              {emailVerified && <Check size={11} strokeWidth={2.5} />}
              {verifying ? "Verifying email..." : emailInvalid ? "Email not verified" : "Email verified"}
            </span>
          )}
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className={`${LABEL} mb-1.5`}>TYPE</legend>
        <div role="radiogroup" aria-label="Feedback type" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CATEGORY_OPTIONS.map((option) => {
            const selected = form.category === option.value;
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => update("category", option.value)}
                className={`flex h-11 items-center justify-center gap-2 rounded-[4px] border font-body fs-14 transition-colors ${
                  selected
                    ? "border-violet bg-violet text-wire"
                    : "border-border-glow-soft text-text-secondary hover:border-border-glow hover:text-text-primary"
                }`}
              >
                <Icon size={15} strokeWidth={1.8} />
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="feedback-message" className={LABEL}>FEEDBACK</label>
          <span className="font-mono text-[10px] text-text-muted">
            {form.message.length}/{MAX_MESSAGE}
          </span>
        </div>
        <textarea
          id="feedback-message"
          required
          rows={6}
          maxLength={MAX_MESSAGE}
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          className={`${FIELD} resize-none border-border-glow-soft py-2.5 focus:border-violet`}
          placeholder="What worked, what didn't, or what would you change?"
        />
      </div>

      <p className="flex items-start gap-2 font-body fs-13 leading-[1.6] text-text-muted">
        <Sparkles size={14} strokeWidth={1.8} className="mt-0.5 shrink-0 text-violet" />
        <span>
          An AI assistant will email you a reply right away. See the{" "}
          <Link href="/privacy" className="text-violet underline underline-offset-2">
            privacy policy
          </Link>{" "}
          for how your feedback is handled.
        </span>
      </p>

      {errorMsg && (
        <div role="alert" className="flex items-center gap-2 font-body fs-13 text-red-600 dark:text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15 dark:bg-white/10">
            <X size={14} strokeWidth={2} />
          </span>
          {errorMsg}
        </div>
      )}

      <Button type="submit" disabled={verifying || emailInvalid || sendMut.isPending} className="self-start">
        {sendMut.isPending ? "Sending..." : "Send feedback"}
      </Button>
    </form>
  );
}
