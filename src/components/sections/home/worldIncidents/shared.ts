import type { IncidentCategory } from "@/lib/home/worldIncidents";

/** UN pins use the accent (amber); the rest of the world a muted red. */
export const PIN_COLOR: Record<IncidentCategory, string> = {
  un: "var(--accent)",
  world: "#e0655b",
};

/** Focus ring for elements on the section's surface-dark background. */
export const focusRingDark =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-surface-dark";

/** Focus ring for elements sitting on a light (ivory) section background. */
export const focusRingLight =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-surface-light";

/** Gold text on light backgrounds (brand gold is ~2:1 there; this is ~6:1). */
export const goldTextOnLight = "text-[#7a5f0e]";

export const formatIncidentDate = (
  iso: string,
  locale: string,
  month: "short" | "long" = "short",
) =>
  new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month,
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
