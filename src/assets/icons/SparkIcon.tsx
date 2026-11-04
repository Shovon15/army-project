/** 8-ray asterisk used in badges and the marquee. */
const SparkIcon = ({
  className,
  strokeWidth = 2.4,
}: {
  className?: string;
  strokeWidth?: number;
}) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
    <path
      d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

export default SparkIcon;
