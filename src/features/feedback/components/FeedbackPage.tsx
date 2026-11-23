import Link from "next/link";
import { FeedbackForm } from "./FeedbackForm";

export function FeedbackPage() {
  return (
    <div className="flex min-h-screen flex-col px-5 py-12 md:px-10 md:py-20 lg:px-[120px]">
      <Link
        href="/"
        className="group self-start font-mono text-[12px] text-text-secondary transition-[color,transform] duration-150 ease-out hover:text-text-primary active:scale-95 active:text-violet"
      >
        <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-x-1 group-active:-translate-x-1.5">←</span> Back To Portfolio
      </Link>

      <div className="mt-10 flex max-w-[720px] flex-col gap-10">
        <div className="flex flex-col gap-3">
          <span className="font-mono fs-12 tracking-[3px] text-violet">FEEDBACK</span>
          <h1 className="font-display fs-32 md:text-[44px] font-semibold leading-[1.1] text-text-primary">
            Help me make this site better
          </h1>
          <p className="font-body fs-15 md:text-[16px] leading-[1.7] text-text-secondary">
            Spotted a bug, have an idea, or did something feel off? Tell me here. My AI assistant will email
            you a reply right away and pass anything that needs my attention on to me.
          </p>
        </div>

        <FeedbackForm />
      </div>
    </div>
  );
}
