/**
 * Mock data for the VYNX Terminal (UI iteration only — NOT real on-chain data).
 * All values are deterministic literals so server/client render identically.
 * Swap for the live indexer once the terminal design is locked.
 */

export type Token = {
  address: string;
  name: string;
  ticker: string;
  emoji: string;
  hue: number;
  price: number; // USD
  change24h: number; // %
  mc: number; // USD
  volume24h: number; // USD
  holders: number;
  ageMin: number; // minutes since launch
  progress: number; // bonding curve % (memecoins)
  liquidity: number; // USD (graduated)
  graduated: boolean;
};

export const TOKENS: Token[] = [
  { address: "EQAtoncat0001xy", name: "TONCAT", ticker: "TCAT", emoji: "🐱", hue: 205, price: 0.000234, change24h: 45.2, mc: 1_240_000, volume24h: 342_000, holders: 4812, ageMin: 18, progress: 64, liquidity: 0, graduated: false },
  { address: "EQAmoonboi002ab", name: "MOONBOI", ticker: "MOON", emoji: "🌙", hue: 212, price: 0.0000812, change24h: 218.4, mc: 840_000, volume24h: 1_120_000, holders: 9330, ageMin: 42, progress: 89, liquidity: 0, graduated: false },
  { address: "EQApepeton003cd", name: "PEPETON", ticker: "PEPE", emoji: "🐸", hue: 200, price: 0.00148, change24h: -12.3, mc: 2_400_000, volume24h: 880_000, holders: 6104, ageMin: 96, progress: 100, liquidity: 184_000, graduated: true },
  { address: "EQAgigaton004ef", name: "GIGATON", ticker: "GIGA", emoji: "🗿", hue: 208, price: 0.0000567, change24h: 8.1, mc: 312_000, volume24h: 96_000, holders: 1455, ageMin: 11, progress: 31, liquidity: 0, graduated: false },
  { address: "EQAtonwave005gh", name: "TONWAVE", ticker: "WAVE", emoji: "🌊", hue: 210, price: 0.000912, change24h: 93.7, mc: 1_750_000, volume24h: 540_000, holders: 5604, ageMin: 64, progress: 97, liquidity: 0, graduated: false },
  { address: "EQAfoxton006ij", name: "FOXTON", ticker: "FOX", emoji: "🦊", hue: 225, price: 0.0000231, change24h: -8.4, mc: 98_000, volume24h: 22_000, holders: 512, ageMin: 7, progress: 22, liquidity: 0, graduated: false },
  { address: "EQAwhale007klmn", name: "WHALEPAD", ticker: "WHLP", emoji: "🐳", hue: 198, price: 0.00412, change24h: 412.5, mc: 5_600_000, volume24h: 2_100_000, holders: 12840, ageMin: 132, progress: 100, liquidity: 420_000, graduated: true },
  { address: "EQAastropup008o", name: "ASTROPUP", ticker: "APUP", emoji: "🚀", hue: 218, price: 0.000124, change24h: 27.9, mc: 540_000, volume24h: 132_000, holders: 1870, ageMin: 28, progress: 54, liquidity: 0, graduated: false },
  { address: "EQAvoidviper009", name: "VOIDVIPER", ticker: "VIPER", emoji: "🐍", hue: 207, price: 0.00231, change24h: 156.3, mc: 1_900_000, volume24h: 720_000, holders: 8090, ageMin: 88, progress: 94, liquidity: 0, graduated: false },
  { address: "EQAlunall010pqr", name: "LUNALLAMA", ticker: "LLAMA", emoji: "🦙", hue: 202, price: 0.0000389, change24h: -3.1, mc: 145_000, volume24h: 26_000, holders: 590, ageMin: 9, progress: 26, liquidity: 0, graduated: false },
  { address: "EQAcometcow011s", name: "COMETCOW", ticker: "MOO", emoji: "🐮", hue: 215, price: 0.000667, change24h: 71.2, mc: 380_000, volume24h: 84_000, holders: 1240, ageMin: 38, progress: 42, liquidity: 0, graduated: false },
  { address: "EQAbluefire012t", name: "BLUEFIRE", ticker: "BFIRE", emoji: "🔥", hue: 211, price: 0.00089, change24h: 134.0, mc: 2_100_000, volume24h: 610_000, holders: 7204, ageMin: 110, progress: 100, liquidity: 256_000, graduated: true },
];

export function getToken(address: string): Token | undefined {
  return TOKENS.find((t) => t.address === address);
}

/* ---------- live activity feed (recent trades from tracked wallets) ---------- */
export type Activity = {
  id: number;
  wallet: string;
  side: "buy" | "sell";
  token: string;
  ticker: string;
  amountTon: number;
  ageSec: number;
};

export const ACTIVITY: Activity[] = [
  { id: 1, wallet: "EQDk7x…4F2a", side: "buy", token: "MOONBOI", ticker: "MOON", amountTon: 12.4, ageSec: 4 },
  { id: 2, wallet: "EQAv9p…7c1d", side: "buy", token: "TONCAT", ticker: "TCAT", amountTon: 3.1, ageSec: 11 },
  { id: 3, wallet: "EQBm2x…9e0f", side: "sell", token: "FOXTON", ticker: "FOX", amountTon: 5.8, ageSec: 23 },
  { id: 4, wallet: "EQCn7r…3a8b", side: "buy", token: "WHALEPAD", ticker: "WHLP", amountTon: 48.0, ageSec: 39 },
  { id: 5, wallet: "EQDk7x…4F2a", side: "buy", token: "VOIDVIPER", ticker: "VIPER", amountTon: 9.2, ageSec: 52 },
  { id: 6, wallet: "EQAp3w…1b6c", side: "sell", token: "PEPETON", ticker: "PEPE", amountTon: 21.5, ageSec: 68 },
  { id: 7, wallet: "EQBq8t…5d2e", side: "buy", token: "TONWAVE", ticker: "WAVE", amountTon: 6.7, ageSec: 80 },
  { id: 8, wallet: "EQCr4y…8f3a", side: "buy", token: "GIGATON", ticker: "GIGA", amountTon: 2.3, ageSec: 95 },
  { id: 9, wallet: "EQAv9p…7c1d", side: "sell", token: "ASTROPUP", ticker: "APUP", amountTon: 14.0, ageSec: 112 },
  { id: 10, wallet: "EQDs6u…2c9b", side: "buy", token: "BLUEFIRE", ticker: "BFIRE", amountTon: 33.6, ageSec: 140 },
];

/* ---------- smart wallets ---------- */
export type Wallet = {
  address: string;
  label: string;
  winRate: number; // %
  pnl: number; // USD, 30d
  volume: number; // USD, 30d
  trades: number;
  recent: string[]; // recent buy tickers
};

export const WALLETS: Wallet[] = [
  { address: "EQDk7x4F2a9c1d3e5f7a", label: "Orbit Whale", winRate: 78, pnl: 1_240_000, volume: 8_400_000, trades: 312, recent: ["MOON", "VIPER", "WHLP"] },
  { address: "EQAv9p7c1d2e4f6a8b0c", label: "Degen King", winRate: 71, pnl: 642_000, volume: 5_100_000, trades: 248, recent: ["TCAT", "WAVE", "PEPE"] },
  { address: "EQBm2x9e0f1a3b5c7d9e", label: "Sniper #1", winRate: 84, pnl: 980_000, volume: 3_900_000, trades: 156, recent: ["GIGA", "MOON", "APUP"] },
  { address: "EQCn7r3a8b2c4d6e8f0a", label: "—", winRate: 66, pnl: 312_000, volume: 2_700_000, trades: 198, recent: ["WHLP", "BFIRE"] },
  { address: "EQAp3w1b6c5d4e3f2a1b", label: "Early Bird", winRate: 73, pnl: 458_000, volume: 2_100_000, trades: 134, recent: ["TONCAT", "FOX"] },
  { address: "EQBq8t5d2e9f1a7b3c5d", label: "—", winRate: 61, pnl: 188_000, volume: 1_600_000, trades: 221, recent: ["VIPER", "WAVE"] },
  { address: "EQCr4y8f3a6b9c2d5e8f", label: "Moon Hunter", winRate: 69, pnl: 274_000, volume: 1_300_000, trades: 102, recent: ["MOON", "MOO"] },
  { address: "EQDs6u2c9b4a7d1e3f5a", label: "—", winRate: 58, pnl: 96_000, volume: 980_000, trades: 167, recent: ["BFIRE", "GIGA"] },
];

/* ---------- alerts ---------- */
export type Alert = {
  id: number;
  type: "Price" | "Volume" | "Wallet Activity" | "New Listing";
  target: string;
  condition: string;
  active: boolean;
};

export const ALERTS: Alert[] = [
  { id: 1, type: "Price", target: "MOONBOI", condition: "crosses above $0.0001", active: true },
  { id: 2, type: "Wallet Activity", target: "Orbit Whale", condition: "any buy > 10 TON", active: true },
  { id: 3, type: "Volume", target: "TONCAT", condition: "24h volume > $500K", active: true },
  { id: 4, type: "New Listing", target: "Any", condition: "market cap > $100K at launch", active: false },
  { id: 5, type: "Price", target: "WHALEPAD", condition: "drops below $0.003", active: false },
];

/* ---------- token detail extras ---------- */
export type Trade = { side: "buy" | "sell"; priceUsd: number; amountTon: number; wallet: string; ageSec: number };
export const TRADES: Trade[] = [
  { side: "buy", priceUsd: 0.000234, amountTon: 12.4, wallet: "EQDk7x…4F2a", ageSec: 4 },
  { side: "buy", priceUsd: 0.000231, amountTon: 3.1, wallet: "EQAv9p…7c1d", ageSec: 17 },
  { side: "sell", priceUsd: 0.000229, amountTon: 5.8, wallet: "EQBm2x…9e0f", ageSec: 31 },
  { side: "buy", priceUsd: 0.000228, amountTon: 48.0, wallet: "EQCn7r…3a8b", ageSec: 52 },
  { side: "buy", priceUsd: 0.000225, amountTon: 9.2, wallet: "EQDk7x…4F2a", ageSec: 74 },
  { side: "sell", priceUsd: 0.000223, amountTon: 21.5, wallet: "EQAp3w…1b6c", ageSec: 98 },
  { side: "buy", priceUsd: 0.000222, amountTon: 6.7, wallet: "EQBq8t…5d2e", ageSec: 120 },
  { side: "buy", priceUsd: 0.00022, amountTon: 2.3, wallet: "EQCr4y…8f3a", ageSec: 155 },
];

export type Holder = { wallet: string; pct: number; label?: string };
export const HOLDERS: Holder[] = [
  { wallet: "EQDk7x…4F2a", pct: 8.4, label: "Orbit Whale" },
  { wallet: "EQAv9p…7c1d", pct: 6.1 },
  { wallet: "EQBm2x…9e0f", pct: 4.7, label: "Sniper #1" },
  { wallet: "EQCn7r…3a8b", pct: 3.9 },
  { wallet: "EQAp3w…1b6c", pct: 3.2 },
  { wallet: "EQBq8t…5d2e", pct: 2.8 },
  { wallet: "EQCr4y…8f3a", pct: 2.1 },
  { wallet: "EQDs6u…2c9b", pct: 1.9 },
];

/* ---------- deterministic candles for the chart ---------- */
export function genCandles(seedStr: string, count = 160, base = 0.0002) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const out: { time: number; open: number; high: number; low: number; close: number }[] = [];
  let price = base;
  const now = Math.floor(Date.now() / 1000);
  const step = 300; // 5m candles
  for (let i = count - 1; i >= 0; i--) {
    const drift = (rand() - 0.46) * 0.08;
    const open = price;
    const close = Math.max(base * 0.2, open * (1 + drift));
    const high = Math.max(open, close) * (1 + rand() * 0.03);
    const low = Math.min(open, close) * (1 - rand() * 0.03);
    out.push({ time: now - i * step, open, high, low, close });
    price = close;
  }
  return out;
}

/* ---------- Pulse (Axiom-style) dense cards ---------- */
export type PulseToken = {
  address: string;
  name: string;
  ticker: string;
  emoji: string;
  hue: number;
  ageSec: number;
  rank: number; // small corner badge
  volumeUsd: number;
  mcUsd: number;
  feeTon: number;
  tx: number;
  holders: number;
  snipers: number;
  pro: number; // pro traders count
  socials: { x: boolean; tg: boolean; web: boolean };
  // 4 risk metrics (%): dev held, top10, sniper supply, bundlers
  risk: [number, number, number, number];
  tradeTon: number;
  progress: number; // bonding %
  dex?: string; // migrated venue
};

export const NEW_PAIRS: PulseToken[] = [
  { address: "EQAnotpengu01", name: "NOTPENGU", ticker: "NPGU", emoji: "🐧", hue: 205, ageSec: 1, rank: 10, volumeUsd: 43, mcUsd: 2040, feeTon: 0.001, tx: 8, holders: 1, snipers: 0, pro: 0, socials: { x: true, tg: true, web: false }, risk: [0, 0, 0, 0], tradeTon: 0.12, progress: 2 },
  { address: "EQAtondoge02", name: "TONDOGE", ticker: "TDOGE", emoji: "🐕", hue: 212, ageSec: 2, rank: 10, volumeUsd: 0, mcUsd: 2070, feeTon: 0.001, tx: 1, holders: 1, snipers: 0, pro: 0, socials: { x: true, tg: false, web: true }, risk: [0, 0, 0, 0], tradeTon: 0.12, progress: 1 },
  { address: "EQAchaton03", name: "CHATON", ticker: "CHAT", emoji: "🐈", hue: 200, ageSec: 7, rank: 3, volumeUsd: 97, mcUsd: 2070, feeTon: 0.002, tx: 2, holders: 6, snipers: 0, pro: 1, socials: { x: true, tg: true, web: true }, risk: [4, 4, 0, 0], tradeTon: 0.12, progress: 6 },
  { address: "EQAbinance04", name: "BINANCEDEATH", ticker: "BDTH", emoji: "💀", hue: 225, ageSec: 10, rank: 99, volumeUsd: 81, mcUsd: 2080, feeTon: 0.023, tx: 4, holders: 1, snipers: 8, pro: 1, socials: { x: false, tg: true, web: true }, risk: [0, 0, 12, 0], tradeTon: 0.12, progress: 4 },
  { address: "EQAclark05", name: "CLARK", ticker: "CLRK", emoji: "🦅", hue: 208, ageSec: 12, rank: 6, volumeUsd: 718, mcUsd: 4000, feeTon: 0.003, tx: 5, holders: 125, snipers: 1, pro: 1, socials: { x: true, tg: true, web: false }, risk: [0, 8, 1, 0], tradeTon: 0.12, progress: 9 },
  { address: "EQAtonwizard06", name: "TONWIZARD", ticker: "WIZ", emoji: "🧙", hue: 210, ageSec: 24, rank: 4, volumeUsd: 1240, mcUsd: 6200, feeTon: 0.004, tx: 14, holders: 88, snipers: 2, pro: 3, socials: { x: true, tg: true, web: true }, risk: [2, 11, 3, 0], tradeTon: 0.12, progress: 14 },
  { address: "EQAcometcow07", name: "COMETCOW", ticker: "MOO", emoji: "🐮", hue: 215, ageSec: 38, rank: 5, volumeUsd: 2100, mcUsd: 12000, feeTon: 0.006, tx: 27, holders: 124, snipers: 1, pro: 4, socials: { x: true, tg: false, web: true }, risk: [0, 14, 2, 1], tradeTon: 0.12, progress: 22 },
];

export const FINAL_STRETCH: PulseToken[] = [
  { address: "EQAtonwave08", name: "TONWAVE", ticker: "WAVE", emoji: "🌊", hue: 210, ageSec: 184, rank: 7, volumeUsd: 34000, mcUsd: 12500, feeTon: 3.625, tx: 702, holders: 90, snipers: 5, pro: 50, socials: { x: true, tg: true, web: true }, risk: [19, 0, 22, 0], tradeTon: 0.2, progress: 92 },
  { address: "EQAvoidviper09", name: "VOIDVIPER", ticker: "VIPER", emoji: "🐍", hue: 207, ageSec: 240, rank: 9, volumeUsd: 41000, mcUsd: 14200, feeTon: 4.21, tx: 880, holders: 142, snipers: 4, pro: 61, socials: { x: true, tg: true, web: false }, risk: [12, 9, 6, 0], tradeTon: 0.2, progress: 94 },
  { address: "EQAmoonboi10", name: "MOONBOI", ticker: "MOON", emoji: "🌙", hue: 212, ageSec: 320, rank: 12, volumeUsd: 38000, mcUsd: 16800, feeTon: 5.02, tx: 1024, holders: 211, snipers: 3, pro: 78, socials: { x: true, tg: true, web: true }, risk: [6, 12, 4, 0], tradeTon: 0.2, progress: 97 },
  { address: "EQAgigaton11", name: "GIGATON", ticker: "GIGA", emoji: "🗿", hue: 208, ageSec: 410, rank: 8, volumeUsd: 29000, mcUsd: 11400, feeTon: 2.88, tx: 640, holders: 156, snipers: 6, pro: 44, socials: { x: false, tg: true, web: true }, risk: [3, 16, 8, 1], tradeTon: 0.2, progress: 91 },
];

export const MIGRATED: PulseToken[] = [
  { address: "EQAkwill12", name: "KWILL", ticker: "KWILL", emoji: "🪶", hue: 205, ageSec: 240, rank: 3, volumeUsd: 98000, mcUsd: 41400, feeTon: 9.11, tx: 2298, holders: 229, snipers: 4, pro: 97, socials: { x: true, tg: true, web: true }, risk: [8, 12, 0, 0], tradeTon: 0.3, progress: 100, dex: "STON.fi" },
  { address: "EQAdeflation13", name: "DEFLATION", ticker: "DEFL", emoji: "📉", hue: 198, ageSec: 840, rank: 40, volumeUsd: 112000, mcUsd: 5210, feeTon: 10.16, tx: 3514, holders: 141, snipers: 11, pro: 51, socials: { x: true, tg: false, web: true }, risk: [6, 3, 0, 0], tradeTon: 0.3, progress: 100, dex: "DeDust" },
  { address: "EQAemotiguy14", name: "EMOTIGUY", ticker: "JOE", emoji: "😀", hue: 218, ageSec: 1080, rank: 18, volumeUsd: 119000, mcUsd: 84200, feeTon: 1.86, tx: 769, holders: 184, snipers: 0, pro: 31, socials: { x: true, tg: true, web: true }, risk: [0, 1, 0, 0], tradeTon: 0.3, progress: 100, dex: "STON.fi" },
  { address: "EQAdroolmao15", name: "DROOLMAO", ticker: "DROOL", emoji: "🤤", hue: 215, ageSec: 1740, rank: 30, volumeUsd: 257000, mcUsd: 80400, feeTon: 1.75, tx: 3238, holders: 455, snipers: 0, pro: 127, socials: { x: true, tg: true, web: false }, risk: [0, 1, 0, 0], tradeTon: 0.3, progress: 100, dex: "DeDust" },
  { address: "EQAfallingcat16", name: "FALLINGCAT", ticker: "FCAT", emoji: "🐈‍⬛", hue: 207, ageSec: 1920, rank: 134, volumeUsd: 152000, mcUsd: 2350, feeTon: 14.59, tx: 3817, holders: 214, snipers: 13, pro: 81, socials: { x: true, tg: true, web: true }, risk: [0, 1, 0, 0], tradeTon: 0.3, progress: 100, dex: "STON.fi" },
  { address: "EQAsummer17", name: "TONSUMMER", ticker: "SUMR", emoji: "🏖️", hue: 211, ageSec: 2040, rank: 8, volumeUsd: 349000, mcUsd: 86700, feeTon: 21.7, tx: 7141, holders: 509, snipers: 8, pro: 252, socials: { x: true, tg: true, web: true }, risk: [4, 6, 0, 0], tradeTon: 0.3, progress: 100, dex: "DeDust" },
];

/* ---------- formatters ---------- */
export function fmtUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString("en-US")}`;
}
export function fmtPrice(n: number): string {
  if (n < 0.001) return `$${n.toFixed(6)}`;
  if (n < 1) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(2)}`;
}
export function fmtAge(min: number): string {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}
export function fmtAgeSec(s: number): string {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h`;
}
