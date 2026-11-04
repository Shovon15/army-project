import { cn } from "@/utils/helpers/cn";

type GlowBackgroundProps = {
  className?: string;
  /** Thin light line along the top edge. */
  topLine?: boolean;
};

/**
 * Deep-navy backdrop with soft crimson glows (right / left), a royal-navy
 * bloom, a faint gold haze and film grain. All colours come from the theme
 * tokens in globals.css. Place inside a `relative isolate` parent with
 * bg-surface-dark; it sits behind the content (-z-10).
 */
const GlowBackground = ({ className, topLine = false }: GlowBackgroundProps) => (
  <div
    aria-hidden
    className={cn("pointer-events-none absolute inset-0 -z-10", className)}
  >
    <div className="absolute -top-[25%] left-[20%] h-[70%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--secondary-rgb)/0.75),transparent)] blur-2xl" />
    <div className="absolute -right-[10%] -bottom-[20%] h-[85%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--primary-rgb)/0.5),transparent)] blur-2xl" />
    <div className="absolute top-[35%] -left-[15%] h-[60%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--primary-rgb)/0.35),transparent)] blur-2xl" />
    <div className="absolute -bottom-[25%] -left-[10%] h-[55%] w-[55%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent-rgb)/0.1),transparent)] blur-2xl" />
    {topLine && <div className="absolute inset-x-0 top-0 h-px bg-accent/25" />}
    <div className="hero-grain absolute inset-0 opacity-[0.14] mix-blend-overlay" />
  </div>
);

export default GlowBackground;
