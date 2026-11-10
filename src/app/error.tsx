"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import StatusScreen from "@/components/common/fallback/StatusScreen";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import routes from "@/config/routes";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  /** Re-fetches and re-renders the failed segment (Next 16.3+). */
  retry: () => void;
}) {
  useEffect(() => {
    // TODO: send to an error reporting service.
    console.error(error);
  }, [error]);

  // Server errors carry a digest that matches the server log entry.
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String((error as { digest?: string }).digest ?? "")
      : "";

  return (
    <StatusScreen
      code="Oops"
      badge="Something Went Wrong"
      titleLines={["A Brushstroke Out", "Of Place"]}
      description="An unexpected error stopped this page from loading. Please try again, or head back to the homepage."
      actions={
        <>
          <PrimaryButton type="button" onClick={() => retry()} arrow>
            Try Again
          </PrimaryButton>
          <PrimaryButton href={routes.home} variant="outline" arrow>
            Back To Home
          </PrimaryButton>
        </>
      }
      footnote={digest ? <>Error reference: {digest}</> : undefined}
    />
  );
}
