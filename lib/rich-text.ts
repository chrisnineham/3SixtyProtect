import 'server-only';

import sanitizeHtml from 'sanitize-html';

/**
 * Admin-authored HTML is sanitised on save, so the database only ever holds
 * markup that is safe to render. Only the tags the editor can produce are
 * allowed; anything else (scripts, styles, event handlers, iframes) is dropped.
 */
export function sanitizeRichText(html: string): string {
  const clean = sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'a'],
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      // Links are authored by admins but read by the public.
      a: sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
    },
  }).trim();

  // TipTap leaves an empty paragraph behind when everything is deleted.
  return clean === '<p></p>' ? '' : clean;
}
