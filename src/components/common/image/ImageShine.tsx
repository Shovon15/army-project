import { cn } from "@/utils/helpers/cn";

type ImageShineProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * "Shiny glass" hover: a translucent white bar, tilted -45°, sits collapsed
 * across the centre of the image. On hover it expands over the whole image
 * while fading to transparent, so a glassy flash sweeps across once. On
 * leave it resets instantly (already invisible), so it never sticks.
 * Styles: globals.css (.img-shine).
 */
const ImageShine = ({ children, className }: ImageShineProps) => (
  <div className={cn("img-shine relative overflow-hidden", className)}>
    {children}
  </div>
);

export default ImageShine;
