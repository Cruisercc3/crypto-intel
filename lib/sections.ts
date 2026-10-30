// News categories. The feeds don't tag categories in a consistent way, so a
// story lands in a section when its title or summary uses one of these words.

export const SECTION_KEYWORDS: Record<string, string[]> = {
  analysis: ["analysis", "technical", "outlook", "prediction", "forecast", "analyst", "price target"],
  macro: ["macro", "federal reserve", "fed", "inflation", "gdp", "interest rate", "economy", "jobs report", "dollar", "cpi", "tariff*"],
  regulation: ["regulat*", "sec", "cftc", "legal", "government", "law", "lawmaker", "compliance", "ban", "court", "senate", "congress", "bill"],
  legal: ["legal", "court", "lawsuit", "judge", "sue*", "settlement", "prosecutor*", "indict*", "sentenc*"],
  trading: ["trading", "trader", "futures", "options", "derivatives", "leverage", "liquidat*", "perp*", "exchange volume"],
  investments: ["invest*", "fund", "funding", "raise", "raised", "venture", "treasury", "acquisition", "acquire*", "stake"],
  defi: ["defi", "decentralized finance", "protocol", "liquidity", "yield", "amm", "dex", "lending"],
  markets: ["market", "price", "trading", "volume", "rally", "rallies", "correction", "sell-off", "selloff"],
  etf: ["etf", "spot etf", "blackrock", "fidelity", "grayscale", "institutional", "inflow", "outflow"],
  mining: ["mining", "miner", "hashrate", "hash rate", "halving", "proof of work", "asic"],
  "layer-2": ["layer 2", "layer-2", "l2", "rollup", "arbitrum", "optimism", "polygon", "base", "scaling"],
  stablecoins: ["stablecoin", "usdt", "usdc", "tether", "dai", "depeg*", "peg"],
  nft: ["nft", "non-fungible", "opensea", "collectible", "digital art"],
  gaming: ["gaming", "game", "play-to-earn", "p2e", "metaverse", "gamefi"],
  web3: ["web3", "web 3", "decentralized", "dapp", "onchain", "on-chain"],
  rwa: ["real world asset", "real-world asset", "rwa", "tokenized", "tokenization", "tokenize*"],
}

export function sectionLabel(slug: string) {
  if (slug === "etf") return "ETF"
  if (slug === "nft") return "NFT"
  if (slug === "defi") return "DeFi"
  if (slug === "rwa") return "RWA"
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}
