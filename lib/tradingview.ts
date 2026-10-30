// Maps a coin symbol to a TradingView pair. Most large caps trade against USDT
// on Binance. Stablecoins, wrapped and staked tokens and smaller coins often have
// no such pair, so the coin page draws CoinGecko's 7-day line for those instead.

const SYMBOL_MAP: Record<string, string> = {
  BTC: "BINANCE:BTCUSDT",
  ETH: "BINANCE:ETHUSDT",
  SOL: "BINANCE:SOLUSDT",
  LINK: "BINANCE:LINKUSDT",
  DOT: "BINANCE:DOTUSDT",
  AAVE: "BINANCE:AAVEUSDT",
  XRP: "BINANCE:XRPUSDT",
  ADA: "BINANCE:ADAUSDT",
  AVAX: "BINANCE:AVAXUSDT",
  MATIC: "BINANCE:POLUSDT",
  POL: "BINANCE:POLUSDT",
  UNI: "BINANCE:UNIUSDT",
  ATOM: "BINANCE:ATOMUSDT",
  NEAR: "BINANCE:NEARUSDT",
  ARB: "BINANCE:ARBUSDT",
  OP: "BINANCE:OPUSDT",
  DOGE: "BINANCE:DOGEUSDT",
  SHIB: "BINANCE:SHIBUSDT",
  PEPE: "BINANCE:PEPEUSDT",
}

const NO_PAIR = new Set(["USDT", "USDC", "DAI", "FDUSD", "TUSD", "PYUSD", "USDE", "USDS", "USD1", "USDD", "EURC", "BUIDL", "USDTB", "USDF", "RLUSD", "GHO", "FRAX", "CRVUSD", "SUSDE", "SUSDS"])

export function getTradingViewSymbol(symbol: string): string {
  const upper = symbol.toUpperCase()
  return SYMBOL_MAP[upper] || `BINANCE:${upper}USDT`
}

// TradingView's free top-150 coverage on Binance pairs is good. Past that, or
// for tokens that don't trade against USDT, use the sparkline.
export function hasTradingViewPair(coin: { symbol: string; name: string; market_cap_rank: number }) {
  const upper = coin.symbol.toUpperCase()
  if (SYMBOL_MAP[upper]) return true
  if (NO_PAIR.has(upper) || upper.startsWith("USD")) return false
  if (/\b(wrapped|staked|bridged|restaked|liquid staking)\b/i.test(coin.name) && upper !== "WBTC") return false
  return (coin.market_cap_rank ?? 9999) <= 150
}
