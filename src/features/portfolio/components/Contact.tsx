"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ease, gsap, registerGsap, NO_REDUCED_MOTION_QUERY } from "@/shared/lib/gsap";
import { SectionEyebrow } from "@/shared/components/ui/SectionHeading";
import { useSendContact } from "@/features/contact/hooks/useSendContact";
import type { ContactFormData } from "@/features/contact/types/types";

const SOCIALS = [
  { label: "github", href: "https://github.com" },
  { label: "linkedin", href: "https://linkedin.com" },
  { label: "twitter", href: "https://twitter.com" },
  { label: "mail", href: "mailto:hello@narihito.dev" },
];

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const sendMut = useSendContact();
  const [form, setForm] = useState<ContactFormData>({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      registerGsap();
      const cta = ctaRef.current;
      if (!cta) return;

      const mm = gsap.matchMedia();

      mm.add(`(min-width: 768px) and ${NO_REDUCED_MOTION_QUERY}`, () => {
        const quickX = gsap.quickTo(cta, "x", { duration: 0.3, ease: ease.interaction });
        const quickY = gsap.quickTo(cta, "y", { duration: 0.3, ease: ease.interaction });
        const radius = 60;

        const onMove = (event: MouseEvent) => {
          const rect = cta.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = event.clientX - cx;
          const dy = event.clientY - cy;
          const dist = Math.hypot(dx, dy);

          if (dist < radius + rect.width / 2) {
            quickX(dx * 0.3);
            quickY(dy * 0.3);
          } else {
            quickX(0);
            quickY(0);
          }
        };

        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      });

      mm.add(`(max-width: 767px) and ${NO_REDUCED_MOTION_QUERY}`, () => {
        const onDown = () => gsap.to(cta, { scale: 0.96, duration: 0.15, ease: ease.interaction });
        const onUp = () => gsap.to(cta, { scale: 1, duration: 0.15, ease: ease.interaction });

        cta.addEventListener("touchstart", onDown);
        cta.addEventListener("touchend", onUp);
        return () => {
          cta.removeEventListener("touchstart", onDown);
          cta.removeEventListener("touchend", onUp);
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMut.mutate(form, {
      onSuccess: () => {
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
      },
    });
  };

  return (
    <section id="contact" ref={sectionRef} className="w-full bg-bg-alt py-16 md:pt-[160px] md:pb-16">
      <div className="mx-5 md:mx-10 lg:mx-[120px] flex flex-col items-start text-left md:items-center md:text-center gap-4.5 md:gap-14">
        <SectionEyebrow>06 - CONTACT</SectionEyebrow>

        <h2 className="font-display text-[34px] md:text-[52px] lg:text-[72px] font-semibold leading-[1.1] md:leading-[1.06] lg:leading-[1.04] tracking-[-1px] md:tracking-[-1.8px] lg:tracking-[-2.8px] text-text-primary lg:max-w-[880px]">
          <span className="md:hidden">
            Let&apos;s build
            <br />
            something that
            <br />
            feels considered.
          </span>
          <span className="hidden md:inline">
            Let&apos;s build something
            <br />
            that feels considered.
          </span>
        </h2>

        <div className="w-full max-w-[600px]">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="font-body text-[16px] text-text-primary">Message sent successfully.</p>
              <p className="font-body text-[14px] text-text-muted">I will get back to you soon.</p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-2 font-mono text-[12px] tracking-[1px] text-text-muted hover:text-text-primary transition-colors"
              >
                SEND ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="font-mono text-[10px] tracking-[1.5px] text-text-muted">NAME</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="h-11 rounded-[4px] border border-border-glow-soft bg-surface px-3 font-body text-[14px] text-text-primary outline-none focus:border-violet transition-colors placeholder:text-text-muted"
                    placeholder="Your name"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="font-mono text-[10px] tracking-[1.5px] text-text-muted">EMAIL</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="h-11 rounded-[4px] border border-border-glow-soft bg-surface px-3 font-body text-[14px] text-text-primary outline-none focus:border-violet transition-colors placeholder:text-text-muted"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] tracking-[1.5px] text-text-muted">MESSAGE</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="rounded-[4px] border border-border-glow-soft bg-surface px-3 py-2.5 font-body text-[14px] text-text-primary outline-none focus:border-violet transition-colors resize-none placeholder:text-text-muted"
                  placeholder="Tell me about your project..."
                />
              </div>
              {sendMut.isError && (
                <p className="font-body text-[13px] text-danger">Failed to send message. Please try again.</p>
              )}
              <button
                type="submit"
                disabled={sendMut.isPending}
                className="self-start mt-1 flex h-12 items-center justify-center rounded-[4px] bg-violet px-8 font-body text-[15px] font-semibold text-wire hover:shadow-[0_10px_28px_-12px_var(--color-violet)] hover:opacity-90 active:opacity-100 transition-all disabled:opacity-50"
              >
                {sendMut.isPending ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          )}
        </div>

        <div className="flex items-center gap-3">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="flex h-[52px] w-[52px] md:h-[42px] md:w-[42px] items-center justify-center rounded-xl bg-chip text-text-secondary"
            >
              <SocialIcon name={social.label} />
            </a>
          ))}
        </div>
      </div>

      <div className="mx-5 md:mx-10 lg:mx-[120px] mt-10 md:mt-14">
        <div className="h-px w-full bg-border-glow-soft" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 pt-5">
          <span className="font-mono text-[11px] md:text-[12px] text-text-muted">
            © 2026 Narihito. Built with love.
          </span>
          <span className="font-mono text-[11px] md:text-[12px] text-text-muted">
            Designed &amp; Developed By Narihito.
          </span>
        </div>
      </div>
    </section>
  );
}

function SocialIcon({ name }: { name: string }) {
  switch (name) {
    case "github":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 10v7M7 7v.01M11 17v-4.5a2.5 2.5 0 0 1 5 0V17" />
        </svg>
      );
    case "twitter":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M22 5.9a8.4 8.4 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.3 8.3 0 0 1-2.6 1 4.1 4.1 0 0 0-7 3.8A11.7 11.7 0 0 1 3.1 4.6a4.2 4.2 0 0 0 1.3 5.5 4.1 4.1 0 0 1-1.9-.5v.1a4.1 4.1 0 0 0 3.3 4 4.2 4.2 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.9A8.3 8.3 0 0 1 2 18.4a11.7 11.7 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5A8.4 8.4 0 0 0 22 5.9Z" />
        </svg>
      );
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 6 8 7 8-7" />
        </svg>
      );
  }
}
