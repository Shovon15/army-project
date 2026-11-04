"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/helpers/cn";

const emailSchema = z.email();

/**
 * TODO: connect to the real newsletter endpoint (none exists in
 * config/api/apiList.ts yet). Until then this rejects so the form never
 * claims a subscription that did not happen.
 */
async function subscribeToNewsletter(email: string): Promise<void> {
  void email;
  throw new Error("Newsletter signup is not available yet.");
}

const SendIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M21.5 2.5 10.6 13.4" />
    <path d="M21.5 2.5 14.6 21.3l-4-7.9-7.9-4z" />
  </svg>
);

const NewsletterForm = ({ className }: { className?: string }) => {
  const { pushToast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!emailSchema.safeParse(value).success) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await subscribeToNewsletter(value);
      setEmail("");
      pushToast({ type: "success", message: "Thanks for subscribing!" });
    } catch (err) {
      pushToast({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className={cn("w-full", className)}>
      <div className="flex items-center gap-1.5">
        <label htmlFor="footer-newsletter" className="sr-only">
          Email address
        </label>
        <input
          id="footer-newsletter"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Enter Email Address*"
          aria-invalid={!!error}
          aria-describedby={error ? "footer-newsletter-error" : undefined}
          className={cn(
            "h-[50px] min-w-0 flex-1 rounded-full border bg-white/[0.08] px-5 font-dmSans text-[15px] text-white placeholder:text-white/80 transition-colors duration-300 outline-none focus:bg-white/[0.12]",
            error
              ? "input-error-shake border-primary"
              : "border-transparent focus:border-white/20",
          )}
        />
        <button
          type="submit"
          disabled={loading}
          aria-label="Subscribe now"
          className="group flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-primary text-white transition-[background-color,transform] duration-300 hover:bg-white hover:text-accent active:scale-95 disabled:opacity-60"
        >
          <SendIcon className="h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-12" />
        </button>
      </div>
      {error && (
        <p
          id="footer-newsletter-error"
          role="alert"
          className="mt-2 pl-5 font-dmSans text-sm text-[#ff6b6b]"
        >
          {error}
        </p>
      )}
    </form>
  );
};

export default NewsletterForm;
