import { Fragment, type ReactNode } from 'react';

/**
 * A headline whose line breaks are fixed from `md` up.
 *
 * Automatic wrapping is measured from the font actually in use, so the same
 * headline can break differently across operating systems, between the webfont
 * and its fallback while it loads, and at different default font sizes. On a
 * hero that shifts the whole page down by a line. Rendering each line as its
 * own block from `md` up removes the measurement from the equation: the same
 * words land on the same lines on every desktop and laptop.
 *
 * Below `md` the spans stay inline, so the words reflow and wrap naturally for
 * the much wider range of phone widths.
 *
 * Each line still wraps if it genuinely cannot fit, so a narrow viewport or an
 * unusually large font degrades gracefully instead of overflowing sideways.
 */
export function FixedLines({ lines }: { lines: ReactNode[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 ? ' ' : null}
          <span className="md:block">{line}</span>
        </Fragment>
      ))}
    </>
  );
}
