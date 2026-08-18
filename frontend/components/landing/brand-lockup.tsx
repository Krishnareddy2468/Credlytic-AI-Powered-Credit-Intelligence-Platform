import Image from "next/image";
import mark from "@/public/brand/mark.png";
import wordmark from "@/public/brand/wordmark.png";

/**
 * Credlytic brand lockup: mark + wordmark artwork with the "Credit intelligence"
 * tagline set as live text.
 *
 * The tagline occupies 29px of the source artwork's 321px height (9%), so as a
 * raster it renders under 5px at any header-appropriate size and cannot resolve
 * 19 characters. Reproducing it as type keeps it crisp and legible while
 * matching the source treatment — tracked caps between two cyan rules.
 *
 * Proportions follow the source (wordmark 0.63x the mark height, 0.17x gap);
 * the tagline is scaled up relative to the source for legibility, which is the
 * usual small-size adaptation of a taglined lockup.
 */
export function BrandLockup({
  priority = false,
  size = "header"
}: {
  priority?: boolean;
  /** `header` hides the tagline on narrow viewports; `footer` always shows it. */
  size?: "header" | "footer";
}) {
  return (
    <span className={`brand-lockup brand-lockup-${size}`}>
      <Image alt="" className="brand-lockup-mark" priority={priority} src={mark} />
      <span className="brand-lockup-text">
        <Image alt="Credlytic" className="brand-lockup-wordmark" priority={priority} src={wordmark} />
        <span className="brand-lockup-tagline">
          <i aria-hidden="true" />
          <b>Credit intelligence</b>
          <i aria-hidden="true" />
        </span>
      </span>
    </span>
  );
}
