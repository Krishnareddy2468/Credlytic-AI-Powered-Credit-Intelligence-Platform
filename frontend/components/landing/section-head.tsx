/**
 * Editorial section head used by every landing section.
 *
 * `editorial` places the index in the left margin beside the headline;
 * `stacked` puts it directly above, for the two-column story sections where the
 * head already sits inside a narrow copy column.
 *
 * Replaces the previous `align-items: end` grid, where the index label was
 * baseline-aligned to the *last* line of a multi-line headline and collided
 * with it at wide viewports.
 */
export function LandingSectionHead({
  className,
  index,
  label,
  lede,
  support,
  title,
  variant = "editorial"
}: {
  className?: string;
  index: string;
  label: string;
  /** Supporting copy directly beneath the headline. */
  lede?: React.ReactNode;
  /** Secondary column beside the headline (editorial variant only). */
  support?: React.ReactNode;
  title: React.ReactNode;
  variant?: "editorial" | "stacked";
}) {
  return (
    <div className={`landing-section-head landing-head-${variant}${className ? ` ${className}` : ""}`}>
      <p className="section-index">
        {index} / {label}
      </p>
      <div className="landing-head-main">
        <h2>{title}</h2>
        {lede ? <div className="landing-head-lede">{lede}</div> : null}
      </div>
      {support ? <div className="landing-head-support">{support}</div> : null}
    </div>
  );
}
