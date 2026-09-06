import Link from "next/link";

export function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg px-5 py-12 md:px-10 md:py-20 lg:px-[120px]">
      <Link
        href="/"
        className="font-mono text-[12px] text-text-secondary transition-colors hover:text-text-primary"
      >
        ← Home
      </Link>

      <div className="mt-10 flex max-w-[720px] flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-[32px] md:text-[44px] font-semibold text-text-primary">
            Privacy Policy
          </h1>
          <p className="font-mono text-[12px] text-text-muted">Last updated: 2026</p>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-[18px] font-semibold text-text-primary">Contact form</h2>
          <p className="font-body text-[15px] leading-[1.7] text-text-secondary">
            If you use the contact form, the name, email address, and message you submit are used only
            to reply to you. They are not sold, shared with third parties, or used for marketing.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-[18px] font-semibold text-text-primary">Chatbot</h2>
          <p className="font-body text-[15px] leading-[1.7] text-text-secondary">
            Messages you send to the chatbot are forwarded to an AI provider to generate a response.
            If you rate a reply with the like or dislike buttons, that rating and the related
            message are stored to help improve the chatbot&apos;s responses. Avoid sharing sensitive
            personal information in the chat.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-[18px] font-semibold text-text-primary">Local storage</h2>
          <p className="font-body text-[15px] leading-[1.7] text-text-secondary">
            Your light/dark theme preference is saved in your browser&apos;s local storage. It never
            leaves your device.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-[18px] font-semibold text-text-primary">Tracking</h2>
          <p className="font-body text-[15px] leading-[1.7] text-text-secondary">
            This site does not use analytics, advertising, or third-party tracking cookies.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-[18px] font-semibold text-text-primary">Contact</h2>
          <p className="font-body text-[15px] leading-[1.7] text-text-secondary">
            Questions about this policy? Reach out via the{" "}
            <Link href="/#contact" className="text-violet underline underline-offset-2">
              contact form
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
