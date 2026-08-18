import { CreditCardVisual } from "@/components/product-ui";
import { landingMatches, landingProfile } from "@/data/landing.mock";

/** Node placement as percentages of the square field, chosen so no node overlaps the core or a sibling. */
const nodeLayout = [
  { left: 24, top: 1 },
  { left: 66, top: 34 },
  { left: 10, top: 66 }
];

const statusLabel: Record<string, string> = {
  "Strong match": "strong match",
  "Good match": "good match",
  Borderline: "improve first",
  "Improve first": "improve first"
};

/**
 * Hero intelligence graphic: candidate cards ranked around a profile score.
 *
 * Sized entirely in percentages inside a square, aspect-ratio field. The
 * previous implementation placed a fixed 590px block at `left: calc(50% + 248px)`,
 * which pushed its right edge past a 1440px viewport and clipped the third card.
 *
 * The whole figure is one `role="img"` with a text alternative; the decorative
 * internals are hidden from assistive technology rather than exposed as a pile
 * of unlabelled fragments.
 */
export function EligibilityOrbit() {
  const description = `Sample Credlytic ranking. Profile strength ${landingProfile.profileStrength} out of 100, ${landingProfile.standing}. ${landingMatches
    .map((match) => `${match.bank} ${match.name}, ${match.match} percent, ${match.status}`)
    .join(". ")}.`;

  return (
    <figure className="hero-intelligence">
      <div aria-label={description} className="orbit-field" role="img">
        <span aria-hidden="true" className="orbit-ring orbit-ring-outer" />
        <span aria-hidden="true" className="orbit-ring orbit-ring-inner" />


        <div aria-hidden="true" className="orbit-core">
          <span>Profile strength</span>
          <strong>
            <b>{landingProfile.profileStrength}</b>
            <em>/100</em>
          </strong>
          <small>{landingProfile.standing}</small>
        </div>

        {landingMatches.map((match, index) => {
          const position = nodeLayout[index];
          return (
            <div
              aria-hidden="true"
              className="orbit-node"
              key={match.id}
              style={{ left: `${position.left}%`, top: `${position.top}%`, ["--node-index" as string]: index }}
            >
              <CreditCardVisual bank={match.bank} meta={match.feeNote} name={match.name} network={match.network} tone={match.tone} />
              <span>
                <b>{match.match}%</b>
                <i>{statusLabel[match.status] ?? match.status.toLowerCase()}</i>
              </span>
            </div>
          );
        })}
      </div>

      <figcaption className="orbit-legend">
        <span className="orbit-legend-factor">
          <i aria-hidden="true" />
          Limiting factor · {landingProfile.limitingFactor} {landingProfile.utilization}%
        </span>
        <span className="orbit-legend-note">Sample profile · illustrative ranking</span>
      </figcaption>
    </figure>
  );
}
