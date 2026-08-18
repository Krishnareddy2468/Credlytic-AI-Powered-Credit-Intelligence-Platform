"use client";

import { useEffect, useRef, useState } from "react";

type RevealElement = "div" | "section" | "article" | "li" | "figure";

/**
 * Reveals its children once they scroll into view.
 *
 * The previous landing page ran its entrance animations on mount, so anything
 * below the fold had already finished animating before the user reached it.
 * This observes instead, and degrades to "visible" when IntersectionObserver
 * is unavailable so content is never trapped at opacity 0.
 */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  once = true
}: {
  as?: RevealElement;
  children: React.ReactNode;
  className?: string;
  /** Stagger offset in milliseconds. */
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    observer.observe(node);

    // Safety net: if the observer never reports (obscured root, layout race),
    // reveal anyway rather than leaving content permanently invisible.
    const fallback = setTimeout(() => setShown(true), 2000);

    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, [once]);

  return (
    <Tag
      className={className}
      data-reveal={shown ? "shown" : "pending"}
      ref={ref as never}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
