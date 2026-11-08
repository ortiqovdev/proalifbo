export function shareUrl(text) {
  const content = `${text}\n\n@proalifbobot`;
  // Desktop rejects an empty url, and rejects drafts whose first visible
  // character is @ (inline query protection). Keep text-only sharing by
  // supplying the complete draft in url, with no separate link or comment.
  const draft = /^[\s\uFFFC]*@/u.test(content) ? `\u2060${content}` : content;
  const params = new URLSearchParams({
    url: draft
  });
  return `https://t.me/share/url?${params}`;
}
