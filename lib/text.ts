// Small text helpers shared by the news route and the client.

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  hellip: "…",
  trade: "™",
  copy: "©",
  reg: "®",
}

// Feeds send titles like "Coinbase&#8217;s" or "&amp;#8217;". Decode twice to
// cover the double-encoded case.
export function decodeHtmlEntities(input: string): string {
  if (!input) return input
  let out = input
  for (let i = 0; i < 2; i++) {
    out = out
      .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(parseInt(code, 10)))
      .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
      .replace(/&([a-z]+);/gi, (match, name) => NAMED_ENTITIES[name.toLowerCase()] ?? match)
  }
  return out
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Whole-word matching. A keyword ending in "*" matches as a prefix
// ("liquidat*" hits "liquidated"), anything else allows a plural or tense
// ending ("rally" hits "rallies" via its own entry, "gain" hits "gains").
// Plain substring matching scored "corruption" as bullish because it contains "up".
export function buildWordMatcher(keywords: readonly string[], flags = "i"): RegExp {
  const parts = keywords.map((kw) =>
    kw.endsWith("*") ? `${escapeRegex(kw.slice(0, -1))}\\w*` : `${escapeRegex(kw)}(?:s|es|ed|d|ing)?`
  )
  return new RegExp(`\\b(?:${parts.join("|")})\\b`, flags)
}

export function countWordMatches(text: string, keywords: readonly string[]): number {
  return keywords.filter((kw) => buildWordMatcher([kw]).test(text)).length
}
