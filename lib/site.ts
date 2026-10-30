// Facts about what the site actually runs on. Copy across the site reads these
// so the numbers on the page match the code.

export const RSS_FEEDS = [
  { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
  { name: "CoinTelegraph", url: "https://cointelegraph.com/rss" },
  { name: "Decrypt", url: "https://decrypt.co/feed" },
  { name: "Bitcoin Magazine", url: "https://bitcoinmagazine.com/.rss/full/" },
  { name: "NewsBTC", url: "https://www.newsbtc.com/feed/" },
  { name: "The Block", url: "https://www.theblock.co/rss.xml" },
  { name: "Crypto Briefing", url: "https://cryptobriefing.com/feed/" },
] as const

export const FEED_COUNT = RSS_FEEDS.length

// CoinGecko's free tier gives 250 coins a page. Two pages load reliably, a third
// gets rate limited from serverless functions, so the markets list stops at 500.
export const MAX_COINS = 500

export const AI_MODEL = "openai/gpt-oss-120b"
export const AI_PROVIDER = "Groq"
