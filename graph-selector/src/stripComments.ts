const isWordChar = (c: string) => /\w/.test(c);
const isLineTerminator = (c: string) =>
  c === "\n" || c === "\r" || c === "\u2028" || c === "\u2029";
const newlinesIn = (s: string) => s.replace(/[^\n]/g, "");

/**
 * Mirrors the fork's lazy /^(['"`])((?:\\\1|[^\1])+?)(\1)/: the body needs at least one char,
 * `[^\1]` is the octal class "not \x01", and on failure the match backtracks to the last
 * escaped quote.
 */
function findClosingQuote(text: string, open: number): number {
  const quote = text.charAt(open);
  let lastEscapedQuote = -1;
  for (let j = open + 1; ; j++) {
    if (j > open + 1 && text.charAt(j) === quote) return j;
    if (j >= text.length || text.charAt(j) === "\x01") return lastEscapedQuote;
    if (text.charAt(j) === "\\" && text.charAt(j + 1) === quote) {
      lastEscapedQuote = j + 1;
      j++;
    }
  }
}

export function stripComments(text: string): string {
  let out = "";
  let keptFrom = 0;
  let depth = 0;
  let i = 0;
  while (i < text.length) {
    const c = text.charAt(i);
    const next = text.charAt(i + 1);
    if (c === "\\") {
      i += 2;
      continue;
    }
    if (depth === 0 && (c === '"' || c === "'" || c === "`") && !isWordChar(text.charAt(i - 1))) {
      const close = findClosingQuote(text, i);
      if (close !== -1) {
        i = close + 1;
        continue;
      }
    }
    if (c === "/" && next === "*") {
      if (depth === 0) {
        out += text.slice(keptFrom, i);
        keptFrom = i;
      }
      depth++;
      i += 2;
      // The fork's opener is /^\/\*\*?/, so `/**/` never closes and swallows the rest of the document.
      if (text.charAt(i) === "*") i++;
      continue;
    }
    if (depth > 0 && c === "*" && next === "/") {
      i += 2;
      if (--depth === 0) {
        out += newlinesIn(text.slice(keptFrom, i));
        keptFrom = i;
      }
      continue;
    }
    if (depth === 0 && c === "/" && next === "/") {
      out += text.slice(keptFrom, i);
      while (i < text.length && !isLineTerminator(text.charAt(i))) i++;
      keptFrom = i;
      continue;
    }
    i++;
  }
  const rest = text.slice(keptFrom);
  return out + (depth > 0 ? newlinesIn(rest) : rest);
}
