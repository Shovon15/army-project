import { cn } from "@/utils/helpers/cn";

type GlowBackgroundProps = {
  className?: string;
  /** Thin light line along the top edge. */
  topLine?: boolean;
};

/**
 * Dark backdrop with soft red glows (right / left), a grey haze bottom-left
 * and film grain. Used by the hero and the footer. Place inside a `relative
 * isolate` parent; it sits behind the content (-z-10).
 */
const GlowBackground = ({ className, topLine = false }: GlowBackgroundProps) => (
  <div
    aria-hidden
    className={cn("pointer-events-none absolute inset-0 -z-10", className)}
  >
    <div className="absolute -right-[10%] -bottom-[20%] h-[85%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgba(150,22,28,0.55),transparent)] blur-2xl" />
    <div className="absolute top-[35%] -left-[15%] h-[60%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(130,18,24,0.45),transparent)] blur-2xl" />
    <div className="absolute -bottom-[25%] -left-[10%] h-[55%] w-[55%] rounded-full bg-[radial-gradient(closest-side,rgba(120,120,120,0.22),transparent)] blur-2xl" />
    {topLine && <div className="absolute inset-x-0 top-0 h-px bg-white/10" />}
    <div className="hero-grain absolute inset-0 opacity-[0.14] mix-blend-overlay" />
  </div>
);

export default GlowBackground;
