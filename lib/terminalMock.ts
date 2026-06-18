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
